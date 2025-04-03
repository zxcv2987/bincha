"use client";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import { useEffect } from "react";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";
import clsx from "clsx";
import Content from "./common/Content";

export default function ReadOnlyTodoList({
  todos,
  categories,
}: {
  todos: TodoType[];
  categories: CategoryType[];
}) {
  const setCategories = useCategoryStore((set) => set.setCategories);
  const categoryState = useCategoryStore((set) => set.categoryState);
  const resetCategory = useCategoryStore((set) => set.resetCategory);
  const setCategory = useCategoryStore((set) => set.setCategory);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <div className="flex min-w-[200px] flex-row flex-wrap border-t border-zinc-200 py-3 md:w-full md:gap-3">
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

      {categories.map(
        (category) =>
          (category.category_name === categoryState ||
            categoryState === null) && (
            <div
              key={category.id}
              className="flex h-auto w-full flex-col gap-3 border-y border-zinc-200 p-4"
            >
              <h2
                key={category.id}
                className="py-2 text-2xl font-bold text-zinc-700"
              >
                {category.category_name}
              </h2>
              {todos.map(
                (todo) =>
                  todo.category.category_name === category.category_name && (
                    <div
                      key={todo.id}
                      className="flex h-auto w-full items-start rounded-xl bg-zinc-50 p-4 text-xl font-medium text-zinc-700"
                    >
                      <div className="flex w-full flex-row items-center bg-zinc-50">
                        <div className="flex w-full flex-col gap-2">
                          <h3 className="w-full truncate text-lg font-bold break-words">
                            {todo.title}
                          </h3>
                          <span className="w-full pl-1 text-base break-words">
                            <Content content={todo.text} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ),
              )}
            </div>
          ),
      )}
    </div>
  );
}
