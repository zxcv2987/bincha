"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useSortable } from "@dnd-kit/react/sortable";
import { CategoryType } from "@/features/category/category.types";
import useRenameCategory from "@/features/category/hooks/useRenameCategory";
import useDeleteCategory from "@/features/category/hooks/useDeleteCategory";

export default function SortableCategoryRow({
  category,
  index,
  instructionsId,
  reorderPending,
  mutationPending,
  beginMutation,
  endMutation,
  onRenamed,
  onDeleted,
}: {
  category: CategoryType;
  index: number;
  instructionsId: string;
  reorderPending: boolean;
  mutationPending: boolean;
  beginMutation: () => boolean;
  endMutation: () => void;
  onRenamed: (category: CategoryType) => void;
  onDeleted: (categoryId: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteConfirmRef = useRef<HTMLButtonElement>(null);
  const { ref, handleRef, isDragging } = useSortable({
    id: category.id,
    index,
    disabled: editing || confirmingDelete || reorderPending || mutationPending,
  });
  const rename = useRenameCategory((renamed) => {
    onRenamed(renamed);
    setEditing(false);
  });
  const remove = useDeleteCategory(() => onDeleted(category.id));

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  useEffect(() => {
    if (confirmingDelete) deleteConfirmRef.current?.focus();
  }, [confirmingDelete]);

  const submitRename = async () => {
    const name = inputRef.current?.value ?? "";
    if (name.trim() === category.category_name) {
      setEditing(false);
      return;
    }
    if (!beginMutation()) return;
    try {
      await rename.submit(category.id, name);
    } finally {
      endMutation();
    }
  };

  return (
    <li
      ref={ref}
      className={clsx(
        "rounded-xl bg-zinc-50 px-3 py-2 transition-[opacity,box-shadow]",
        isDragging && "z-10 opacity-70 shadow-lg",
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <button
          ref={handleRef}
          type="button"
          aria-label={`${category.category_name} 순서 변경`}
          aria-describedby={instructionsId}
          disabled={
            editing || confirmingDelete || reorderPending || mutationPending
          }
          className="shrink-0 cursor-grab rounded-md px-1.5 py-2 text-base leading-none text-zinc-400 hover:bg-white hover:text-zinc-700 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
        >
          ⠿
        </button>

        {editing ? (
          <input
            ref={inputRef}
            defaultValue={category.category_name}
            aria-label="카테고리 이름"
            className="input min-w-0 flex-1 py-1.5 text-sm"
            disabled={rename.pending}
            onKeyDown={(event) => {
              if (event.key === "Escape") setEditing(false);
              if (event.key === "Enter") {
                event.preventDefault();
                submitRename();
              }
            }}
          />
        ) : (
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-700">
            {category.category_name.trim() || "이름 없음"}
          </span>
        )}

        {editing ? (
          <>
            <button
              type="button"
              disabled={rename.pending}
              onClick={() => submitRename()}
              className="shrink-0 rounded-md px-2 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 disabled:opacity-50"
            >
              {rename.pending ? "저장 중" : "저장"}
            </button>
            <button
              type="button"
              disabled={rename.pending}
              onClick={() => setEditing(false)}
              className="shrink-0 rounded-md px-2 py-1.5 text-sm text-zinc-500 hover:bg-white disabled:opacity-50"
            >
              취소
            </button>
          </>
        ) : confirmingDelete ? (
          <>
            <span className="shrink-0 text-xs text-red-600">삭제할까요?</span>
            <button
              ref={deleteConfirmRef}
              type="button"
              disabled={remove.pending}
              onClick={async () => {
                if (!beginMutation()) return;
                try {
                  await remove.submit(category.id);
                } finally {
                  endMutation();
                }
              }}
              className="shrink-0 rounded-md bg-red-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {remove.pending ? "삭제 중" : "삭제"}
            </button>
            <button
              type="button"
              disabled={remove.pending}
              onClick={() => setConfirmingDelete(false)}
              className="shrink-0 rounded-md px-2 py-1.5 text-xs text-zinc-500 hover:bg-white disabled:opacity-50"
            >
              취소
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={mutationPending}
              onClick={() => setEditing(true)}
              className="shrink-0 rounded-md px-2 py-1.5 text-sm text-zinc-500 hover:bg-white hover:text-zinc-800"
            >
              수정
            </button>
            <button
              type="button"
              disabled={mutationPending}
              onClick={() => setConfirmingDelete(true)}
              className="shrink-0 rounded-md px-2 py-1.5 text-sm text-zinc-500 hover:bg-red-50 hover:text-red-700"
            >
              삭제
            </button>
          </>
        )}
      </div>
      {(rename.error || remove.error) && (
        <p role="alert" className="pt-1 pl-9 text-xs text-red-600">
          {rename.error ?? remove.error}
        </p>
      )}
    </li>
  );
}
