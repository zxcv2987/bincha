"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { CategoryType } from "@/features/category/category.types";
import { useCategoryStore } from "@/features/category/provider";
import useReorderCategories from "@/features/category/hooks/useReorderCategories";
import SortableCategoryRow from "@/features/category/components/SortableCategoryRow";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function CategoryManagementDialog({
  categories,
  onClose,
}: {
  categories: CategoryType[];
  onClose: () => void;
}) {
  const [orderedCategories, setOrderedCategories] = useState(categories);
  const [mutationPending, setMutationPending] = useState(false);
  const mutationPendingRef = useRef(false);
  const restoreFocusAfterMutationRef = useRef(false);
  const listRef = useRef<HTMLUListElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const instructionsId = useId();
  const setCategories = useCategoryStore((state) => state.setCategories);
  const selectedCategoryId = useCategoryStore(
    (state) => state.selectedCategoryId,
  );
  const resetCategory = useCategoryStore((state) => state.resetCategory);
  const reorder = useReorderCategories();

  const replaceCategories = (next: CategoryType[]) => {
    setOrderedCategories(next);
    setCategories(next);
  };

  const beginMutation = () => {
    if (mutationPendingRef.current) return false;
    mutationPendingRef.current = true;
    setMutationPending(true);
    return true;
  };

  const endMutation = () => {
    mutationPendingRef.current = false;
    setMutationPending(false);
  };

  useEffect(() => {
    if (mutationPending || !restoreFocusAfterMutationRef.current) return;
    restoreFocusAfterMutationRef.current = false;
    const nextControl = listRef.current?.querySelector<HTMLButtonElement>(
      "button:not([disabled])",
    );
    (nextControl ?? closeButtonRef.current)?.focus();
  }, [mutationPending]);

  return (
    <div className="flex w-[min(34rem,calc(100vw-4rem))] flex-col gap-4">
      <div>
        <p className="text-sm text-zinc-600">
          이름과 순서는 변경 즉시 저장됩니다.
        </p>
        <p id={instructionsId} className="sr-only">
          순서 변경 버튼에 초점을 둔 뒤 Enter 또는 Space를 누르고, 방향키로
          이동한 다음 다시 Enter 또는 Space를 눌러 완료하세요.
        </p>
      </div>

      {orderedCategories.length === 0 ? (
        <p className="rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          관리할 카테고리가 없습니다.
        </p>
      ) : (
        <DragDropProvider
          onDragEnd={async (event) => {
            if (event.canceled) return;
            if (!beginMutation()) return;
            const next = move(orderedCategories, event);
            if (
              next.every(
                (category, index) => category.id === orderedCategories[index]?.id,
              )
            ) {
              endMutation();
              return;
            }

            const previous = orderedCategories;
            replaceCategories(
              next.map((category, index) => ({
                ...category,
                sort_order: index,
              })),
            );
            try {
              const result = await reorder.submit(next.map(({ id }) => id));
              if (!result?.ok) replaceCategories(previous);
            } finally {
              endMutation();
            }
          }}
        >
          <ul
            ref={listRef}
            className="flex flex-col gap-2"
            aria-label="카테고리 순서"
          >
            {orderedCategories.map((category, index) => (
              <SortableCategoryRow
                key={category.id}
                category={category}
                index={index}
                instructionsId={instructionsId}
                reorderPending={reorder.pending}
                mutationPending={mutationPending}
                beginMutation={beginMutation}
                endMutation={endMutation}
                onRenamed={(renamed) =>
                  replaceCategories(
                    orderedCategories.map((item) =>
                      item.id === renamed.id ? renamed : item,
                    ),
                  )
                }
                onDeleted={(categoryId) => {
                  const next = orderedCategories.filter(
                    ({ id }) => id !== categoryId,
                  );
                  replaceCategories(next);
                  if (selectedCategoryId === categoryId) resetCategory();
                  restoreFocusAfterMutationRef.current = true;
                }}
              />
            ))}
          </ul>
        </DragDropProvider>
      )}

      {reorder.error && (
        <p role="alert" className="text-sm text-red-600">
          {reorder.error}
        </p>
      )}

      <div className="flex justify-end border-t border-zinc-100 pt-3">
        <button
          ref={closeButtonRef}
          type="button"
          disabled={mutationPending}
          onClick={onClose}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          <ButtonLabel pending={mutationPending} pendingText="저장 중...">
            닫기
          </ButtonLabel>
        </button>
      </div>
    </div>
  );
}
