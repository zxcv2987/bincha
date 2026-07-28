"use client";

import clsx from "clsx";
import useModal from "@/features/shared/hooks/useModal";
import useDeleteCategory from "@/features/category/hooks/useDeleteCategory";

export default function CategoryMenu({ categoryId }: { categoryId: number }) {
  const { isOpen, setIsOpen, modalRef, setIsLoading } = useModal();
  const { submit, pending, error } = useDeleteCategory();

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
          className="absolute right-1 -bottom-14 z-10 w-64 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <button
            className={clsx(
              "z-20 rounded-lg px-4 py-2 text-red-500 hover:bg-zinc-50",
              pending ? "disabled opacity-50" : "",
            )}
            disabled={pending}
            onClick={async () => {
              setIsLoading(true);
              await submit(categoryId);
              setIsLoading(false);
            }}
          >
            {pending ? "삭제 중..." : "카테고리 삭제"}
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
