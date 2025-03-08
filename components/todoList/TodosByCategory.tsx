"use client";

import { CategoryType } from "@/types/category";
import DeleteCategoryButton from "../category/DeleteCtegoryButton";
import useModal from "@/utils/hooks/useModal";

export default function TodosByCategory({
  category,
}: {
  category: CategoryType;
}) {
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
    <div className="relative flex flex-row items-center justify-between">
      <h2 key={category.id} className="py-2 text-2xl font-bold text-zinc-700">
        {category.category_name}
      </h2>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg px-3 py-1 text-lg hover:bg-zinc-100"
      >
        ⋮
      </button>
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-1 -bottom-14 z-10 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
        >
          <DeleteCategoryButton categoryId={category.id} />
        </div>
      )}
    </div>
  );
}
