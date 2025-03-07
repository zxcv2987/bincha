"use client";
import { CategoryType } from "@/types/category";
import clsx from "clsx";
import { useState } from "react";
import CategoryForm from "@/components/category/CategoryForm";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";

export default function Category({
  categories,
  selected,
  setSelected,
}: {
  categories: CategoryType[];
  selected: String;
  setSelected: Function;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex h-auto w-full flex-row items-center justify-between gap-4 border-y-1 border-zinc-200 p-2">
      <div className="flex min-w-[200px] flex-row flex-wrap md:w-full md:gap-3">
        <h2
          className={clsx(
            "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
            selected === "전체" && "font-semibold text-zinc-700",
          )}
          onClick={() => setSelected("전체")}
        >
          전체
        </h2>
        {categories.map((category) => (
          <div key={category.id} className="relative flex items-center">
            <h2
              className={clsx(
                "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
                selected === category.category_name &&
                  "font-semibold text-zinc-700",
              )}
              onClick={() => setSelected(category.category_name)}
            >
              {category.category_name}
            </h2>
          </div>
        ))}
      </div>
      <Button className="md:max-w-[200px]" onClick={() => setIsOpen(true)}>
        카테고리 추가 +
      </Button>
      {isOpen && (
        <Modal
          closeFn={() => {
            setIsOpen(false);
          }}
        >
          <CategoryForm />
        </Modal>
      )}
    </div>
  );
}
