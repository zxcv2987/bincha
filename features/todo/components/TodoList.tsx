"use client";

import { CategoryType } from "@/features/category/types";
import { TodoType } from "@/features/todo/types";
import { useEffect } from "react";
import TodosByCategory from "@/features/todo/components/TodosByCategory";
import CreateTodoButton from "@/features/todo/components/CreateTodoButton";
import Todo from "@/features/todo/components/Todo";
import { useCategoryStore } from "@/features/category/provider";
import CategoryList from "@/features/category/components/CategoryList";
import CreateCategoryButton from "@/features/category/components/CreateCategoryButton";

export default function TodoList({
  todos,
  categories,
  isReadOnly = false,
}: {
  todos: TodoType[];
  categories: CategoryType[];
  isReadOnly?: boolean;
}) {
  const setCategories = useCategoryStore((s) => s.setCategories);
  const categoryState = useCategoryStore((s) => s.categoryState);
  const resetCategory = useCategoryStore((s) => s.resetCategory);
  const setCategory = useCategoryStore((s) => s.setCategory);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  return (
    <div
      className={
        isReadOnly
          ? "flex w-full flex-col items-start justify-center"
          : "flex w-full flex-col"
      }
    >
      <div
        className={
          isReadOnly
            ? undefined
            : "flex flex-col items-center justify-between gap-2 border-t border-zinc-200 md:w-full md:flex-row"
        }
      >
        <CategoryList
          categoryState={categoryState}
          resetCategory={resetCategory}
          categories={categories}
          setCategory={setCategory}
        />
        {!isReadOnly && <CreateCategoryButton />}
      </div>
      {!isReadOnly && <CreateTodoButton />}

      {categories.map(
        (category) =>
          (category.category_name === categoryState ||
            categoryState === null) && (
            <TodosByCategory
              key={category.id}
              category={category}
              isReadOnly={isReadOnly}
            >
              {todos.map(
                (todo) =>
                  todo.category.category_name === category.category_name && (
                    <Todo key={todo.id} todo={todo} isReadOnly={isReadOnly} />
                  ),
              )}
            </TodosByCategory>
          ),
      )}
    </div>
  );
}
