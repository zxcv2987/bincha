"use client";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import { useState } from "react";
import Category from "@/components/category/Category";
import TodosByCategory from "@/components/todoList/TodosByCategory";
import CreateTodoList from "@/components/todoList/CreateTodoList";
import Todo from "@/components/todoList/Todo";

export default function TodoList({
  todos,
  categories,
}: {
  todos: TodoType[];
  categories: CategoryType[];
}) {
  const [selected, setSelected] = useState<string>("전체");

  return (
    <div className="flex w-full flex-col items-start justify-center">
      <Category
        categories={categories}
        selected={selected}
        setSelected={setSelected}
      />
      <CreateTodoList categories={categories} />

      {categories.map(
        (category) =>
          (category.category_name === selected || selected === "전체") && (
            <div
              key={category.id}
              className="flex h-auto w-full flex-col gap-1 border-y border-zinc-200 p-4"
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
