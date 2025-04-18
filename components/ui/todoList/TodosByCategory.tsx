"use client";

import { CategoryType } from "@/types/category";
import DeleteCategoryButton from "@/components/ui/category/DeleteCtegoryButton";

export default function TodosByCategory({
  category,
  children,
  isReadOnly,
}: {
  category: CategoryType;
  children: React.ReactNode;
  isReadOnly?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-2 border-y border-zinc-200 py-4">
      <div className="relative flex flex-row items-center justify-between">
        <h2 key={category.id} className="py-2 text-2xl font-bold text-zinc-700">
          {category.category_name}
        </h2>
        {!isReadOnly && <DeleteCategoryButton categoryId={category.id} />}
      </div>
      {children}
    </div>
  );
}
