import clsx from "clsx";
import { CategoryType } from "@/features/category/types";
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
        "w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
        categoryState === category.category_name &&
          "bg-brand-50 font-semibold text-brand-700 hover:bg-brand-50",
      )}
      onClick={() => setCategory(category.category_name)}
    >
      {category.category_name.trim() || "이름 없음"}
    </button>
  );
}
