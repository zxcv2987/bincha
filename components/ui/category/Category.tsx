"use client";
import clsx from "clsx";
import CategoryForm from "@/components/ui/category/CategoryForm";
import Modal from "@/components/common/modal/Modal";
import { useModalStore } from "@/utils/providers/ModalProvider";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";

export default function Category() {
  const { open } = useModalStore((set) => set);
  const { categories, categoryState, setCategory, resetCategory } =
    useCategoryStore((set) => set);

  return (
    <div className="flex h-auto w-full flex-col-reverse items-center justify-between gap-4 border-y-1 border-zinc-200 p-2 md:flex-row">
      <div className="flex min-w-[200px] flex-row flex-wrap md:w-full md:gap-3">
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
            <h2
              className={clsx(
                "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
                categoryState === category.category_name &&
                  "font-semibold text-zinc-700",
              )}
              onClick={() => setCategory(category.category_name)}
            >
              {category.category_name}
            </h2>
          </div>
        ))}
      </div>
      <button
        className="btn w-full md:max-w-[200px]"
        onClick={() => open("category")}
      >
        카테고리 추가 +
      </button>
      <Modal modalType="category">
        <Modal.Title>카테고리</Modal.Title>
        <CategoryForm />
      </Modal>
    </div>
  );
}
