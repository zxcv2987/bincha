"use client";

import { CategoryType } from "@/features/category/types";
import DeleteCategoryButton from "@/features/category/components/DeleteCategoryButton";
import TodoEmptyCard from "@/features/todo/components/TodoEmptyCard";

export default function TodosByCategory({
  category,
  children,
  isEmpty = false,
}: {
  category: CategoryType;
  children: React.ReactNode;
  isEmpty?: boolean;
}) {
  const categoryName = category.category_name.trim() || "이름 없음";

  return (
    <div className="flex w-full flex-col border-y border-zinc-200 py-2">
      <div className="relative flex flex-row items-center justify-between px-1">
        <h2 key={category.id} className="py-1.5 text-base font-bold text-zinc-700">
          {categoryName}
        </h2>
        <DeleteCategoryButton categoryId={category.id} />
      </div>
      {isEmpty ? (
        <TodoEmptyCard message="이 카테고리에 할 일이 없습니다." />
      ) : (
        <div className="flex flex-col divide-y divide-zinc-100">
          {children}
        </div>
      )}
    </div>
  );
}
