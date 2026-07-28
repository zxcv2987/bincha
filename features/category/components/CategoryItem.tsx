import clsx from "clsx";
import { CategoryType } from "@/features/category/category.types";
export default function CategoryItem({
  category,
  selectedCategoryId,
  setCategory,
}: {
  category: CategoryType;
  selectedCategoryId: number | null;
  setCategory: (categoryId: number) => void;
}) {
  const selected = selectedCategoryId === category.id;

  return (
    <button
      className={clsx(
        "min-w-0 flex-1 cursor-pointer truncate rounded-lg px-3 py-1.5 text-left text-sm",
        selected
          ? "bg-brand-50 font-semibold text-brand-700"
          : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
      )}
      onClick={() => setCategory(category.id)}
    >
      {category.category_name.trim() || "이름 없음"}
    </button>
  );
}
