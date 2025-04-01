"use client";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import { useEffect } from "react";
import Category from "@/components/category/Category";
import TodosByCategory from "@/components/todoList/TodosByCategory";
import CreateTodoList from "@/components/todoList/CreateTodoList";
import Todo from "@/components/todoList/Todo";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";

export default function TodoList({
  todos,
  categories,
}: {
  todos: TodoType[];
  categories: CategoryType[];
}) {
  const setCategories = useCategoryStore((set) => set.setCategories);
  const categoryState = useCategoryStore((set) => set.categoryState);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <Category />
      <CreateTodoList />

      {categories.map(
        (category) =>
          (category.category_name === categoryState ||
            categoryState === null) && (
            <div
              key={category.id}
              className="flex h-auto w-full flex-col gap-3 border-y border-zinc-200 p-4"
            >
              <TodosByCategory category={category} />
              {todos.map(
                (todo) =>
                  todo.category.category_name === category.category_name && (
                    <Todo key={todo.id} todo={todo} />
                  ),
              )}
            </div>
          ),
      )}
    </div>
  );
}
