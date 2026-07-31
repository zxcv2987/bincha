import { CategoryType } from "@/features/category/category.types";
import clsx from "clsx";
import CategoryItem from "@/features/category/components/CategoryItem";

export default function CategoryList({
  selectedCategoryId,
  resetCategory,
  categories,
  setCategory,
}: {
  selectedCategoryId: number | null;
  resetCategory: () => void;
  categories: CategoryType[];
  setCategory: (categoryId: number) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        className={clsx(
          "w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none",
          selectedCategoryId === null
            ? "bg-brand-50 font-semibold text-brand-700"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
        )}
        onClick={resetCategory}
      >
        전체
      </button>
      {categories.map((category) => (
        <div key={category.id} className="flex w-full items-center">
          <CategoryItem
            category={category}
            selectedCategoryId={selectedCategoryId}
            setCategory={setCategory}
          />
        </div>
      ))}
    </div>
  );
}
