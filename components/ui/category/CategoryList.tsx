import { CategoryType } from "@/types/category";
import clsx from "clsx";
import CategoryItem from "@/components/ui/category/CategoryItem";

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
    <div className="flex flex-row flex-wrap gap-2 py-3">
      <h2
        className={clsx(
          "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
          categoryState === null && "font-semibold text-zinc-700",
        )}
        onClick={resetCategory}
      >
        전체
      </h2>
      {categories.map((category) => (
        <div key={category.id} className="relative flex items-center">
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
