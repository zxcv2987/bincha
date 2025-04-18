import clsx from "clsx";
import { CategoryType } from "@/types/category";
export default function CategoryItem({
  category,
  categoryState,
  setCategory,
}: {
  category: CategoryType;
  categoryState: string | null;
  setCategory: (category: string) => void;
}) {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
        categoryState === category.category_name &&
          "font-semibold text-zinc-700",
      )}
      onClick={() => setCategory(category.category_name)}
    >
      {category.category_name}
    </button>
  );
}
