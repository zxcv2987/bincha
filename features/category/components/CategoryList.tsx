import { CategoryType } from "@/features/category/types";
import clsx from "clsx";
import CategoryItem from "@/features/category/components/CategoryItem";

export default function CategoryList({
  categoryState,
  resetCategory,
  categories,
  setCategory,
}: {
  categoryState: string | null;
  resetCategory: () => void;
  categories: CategoryType[];
  setCategory: (category: string) => void;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        className={clsx(
          "w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
          categoryState === null &&
            "bg-brand-50 font-semibold text-brand-700 hover:bg-brand-50",
        )}
        onClick={resetCategory}
      >
        전체
      </button>
      {categories.map((category) => (
        <div key={category.id} className="relative flex w-full items-center">
          <CategoryItem
            category={category}
            categoryState={categoryState}
            setCategory={setCategory}
          />
        </div>
      ))}
    </div>
  );
}
