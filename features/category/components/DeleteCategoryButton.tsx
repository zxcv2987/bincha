"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/features/category/category.actions";
import clsx from "clsx";
import useModal from "@/features/shared/hooks/useModal";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: number;
}) {
  const { isOpen, setIsOpen, modalRef, setIsLoading } = useModal();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="카테고리 더보기"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="rounded-lg px-3 py-1 text-lg hover:bg-zinc-100"
      >
        ⋮
      </button>
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-1 -bottom-14 z-10 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <button
            className={clsx(
              "z-20 rounded-lg px-4 py-2 text-red-500 hover:bg-zinc-50",
              isPending ? "disabled opacity-50" : "",
            )}
            disabled={isPending}
            onClick={() => {
              setError(undefined);
              setIsLoading(true);
              startTransition(async () => {
                const res = await deleteCategoryAction(
                  { ok: false },
                  categoryId,
                );
                if (res.ok) {
                  router.refresh();
                } else {
                  setError("삭제에 실패했습니다. 다시 시도해 주세요.");
                }
                setIsLoading(false);
              });
            }}
          >
            {isPending ? "삭제 중..." : "카테고리 삭제"}
          </button>
          {error && (
            <span className="block px-4 pt-1 text-xs text-red-400">
              {error}
            </span>
          )}
        </div>
      )}
    </>
  );
}
