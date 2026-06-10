"use client";

import { CategoryType } from "@/features/category/types";
import DeleteCategoryButton from "@/features/category/components/DeleteCategoryButton";
import ListEmptyState from "@/features/shared/components/ListEmptyState";

export default function TodosByCategory({
  category,
  children,
  isReadOnly,
  isEmpty = false,
}: {
  category: CategoryType;
  children: React.ReactNode;
  isReadOnly?: boolean;
  isEmpty?: boolean;
}) {
  const categoryName = category.category_name.trim() || "이름 없음";

  return (
    <div className="flex w-full flex-col gap-2 border-y border-zinc-200 py-4">
      <div className="relative flex flex-row items-center justify-between">
        <h2 key={category.id} className="py-2 text-2xl font-bold text-zinc-700">
          {categoryName}
        </h2>
        {!isReadOnly && <DeleteCategoryButton categoryId={category.id} />}
      </div>
      {isEmpty ? (
        <ListEmptyState
          message="이 카테고리에 할 일이 없습니다."
          className="py-4"
        />
      ) : (
        children
      )}
    </div>
  );
}
