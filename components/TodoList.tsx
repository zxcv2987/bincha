"use client";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import { useEffect } from "react";
import TodosByCategory from "@/components/ui/todoList/TodosByCategory";
import CreateTodoButton from "@/components/ui/todoList/CreateTodoButton";
import Todo from "@/components/ui/todoList/Todo";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";
import CategoryList from "@/components/ui/category/CategoryList";
import CreateCategoryButton from "@/components/ui/category/CreateCategoryButton";

export default function TodoList({
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
    <div className="flex w-full flex-col">
      <div className="flex flex-col items-center justify-between gap-2 border-t border-zinc-200 md:w-full md:flex-row">
        <CategoryList
          categoryState={categoryState}
          resetCategory={resetCategory}
          categories={categories}
          setCategory={setCategory}
        />
        <CreateCategoryButton />
      </div>
      <CreateTodoButton />

      {categories.map(
        (category) =>
          (category.category_name === categoryState ||
            categoryState === null) && (
            <TodosByCategory key={category.id} category={category}>
              {todos.map(
                (todo) =>
                  todo.category.category_name === category.category_name && (
                    <Todo key={todo.id} todo={todo} />
                  ),
              )}
            </TodosByCategory>
          ),
      )}
    </div>
  );
}
