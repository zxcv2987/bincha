"use client";

import { CategoryType } from "@/features/category/types";
import { TodoType } from "@/features/todo/types";
import { useEffect, useState } from "react";
import clsx from "clsx";
import TodosByCategory from "@/features/todo/components/TodosByCategory";
import CreateTodoButton from "@/features/todo/components/CreateTodoButton";
import Todo from "@/features/todo/components/Todo";
import { useCategoryStore } from "@/features/category/provider";
import CategoryList from "@/features/category/components/CategoryList";
import CreateCategoryButton from "@/features/category/components/CreateCategoryButton";
import TodoEmptyCard from "@/features/todo/components/TodoEmptyCard";

export default function TodoList({
  todos,
  categories,
}: {
  todos: TodoType[];
  categories: CategoryType[];
}) {
  const [completionFilter, setCompletionFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const setCategories = useCategoryStore((s) => s.setCategories);
  const categoryState = useCategoryStore((s) => s.categoryState);
  const resetCategory = useCategoryStore((s) => s.resetCategory);
  const setCategory = useCategoryStore((s) => s.setCategory);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  const visibleCategories = categories.filter(
    (category) =>
      categoryState === null || category.category_name === categoryState,
  );
  const filteredTodos = todos.filter((todo) => {
    if (completionFilter === "active") return !todo.completed;
    if (completionFilter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-200 md:w-full md:flex-row">
        <CategoryList
          categoryState={categoryState}
          resetCategory={resetCategory}
          categories={categories}
          setCategory={setCategory}
        />
        <div className="flex gap-1" aria-label="완료 상태 필터">
          {(
            [
              ["all", "전체"],
              ["active", "진행 중"],
              ["completed", "완료"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={clsx(
                "rounded-lg p-2 text-sm text-zinc-400 hover:text-zinc-700",
                completionFilter === value &&
                  "bg-brand-50 font-semibold text-brand-700",
              )}
              onClick={() => setCompletionFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <CreateCategoryButton />
      </div>
      <CreateTodoButton />

      {filteredTodos.length === 0 ? (
        <TodoEmptyCard
          message={
            todos.length === 0
              ? "할 일을 추가해 보세요."
              : "선택한 상태의 할 일이 없습니다."
          }
        />
      ) : visibleCategories.length === 0 ? (
        <TodoEmptyCard message="선택한 카테고리에 할 일이 없습니다." />
      ) : (
        visibleCategories.map((category) => {
          const categoryTodos = filteredTodos.filter(
            (todo) => todo.category.category_name === category.category_name,
          );

          return (
            <TodosByCategory
              key={category.id}
              category={category}
              isEmpty={categoryTodos.length === 0}
            >
              {categoryTodos.map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
            </TodosByCategory>
          );
        })
      )}
    </div>
  );
}
