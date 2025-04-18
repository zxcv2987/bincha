"use client";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import { useEffect } from "react";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";

import CategoryList from "@/components/ui/category/CategoryList";
import TodosByCategory from "@/components/ui/todoList/TodosByCategory";
import Todo from "@/components/ui/todoList/Todo";

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
      <CategoryList
        categoryState={categoryState}
        resetCategory={resetCategory}
        categories={categories}
        setCategory={setCategory}
      />

      {categories.map(
        (category) =>
          (category.category_name === categoryState ||
            categoryState === null) && (
            <TodosByCategory key={category.id} category={category} isReadOnly>
              {todos.map(
                (todo) =>
                  todo.category.category_name === category.category_name && (
                    <Todo key={todo.id} todo={todo} isReadOnly />
                  ),
              )}
            </TodosByCategory>
          ),
      )}
    </div>
  );
}
