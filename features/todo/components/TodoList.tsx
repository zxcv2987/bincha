"use client";

import { CategoryType } from "@/features/category/category.types";
import { TodoType } from "@/features/todo/todo.types";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Sidebar from "@/features/shared/components/Sidebar";
import TodosByCategory from "@/features/shared/components/TodosByCategory";
import CreateTodoButton from "@/features/todo/components/CreateTodoButton";
import TodoItem from "@/features/todo/components/TodoItem";
import { useCategoryStore } from "@/features/category/provider";
import CategoryList from "@/features/category/components/CategoryList";
import CreateCategoryButton from "@/features/category/components/CreateCategoryButton";
import TodoEmptyCard from "@/features/todo/components/TodoEmptyCard";
import CategoryManagementButton from "@/features/category/components/CategoryManagementButton";
import MobileTodoToolbar from "@/features/todo/components/MobileTodoToolbar";
import {
  COMPLETION_FILTERS,
  CompletionFilter,
  filterTodosByCompletion,
} from "@/features/todo/todoFilters";

export default function TodoList({
  todos,
  categories,
}: {
  todos: TodoType[];
  categories: CategoryType[];
}) {
  const [completionFilter, setCompletionFilter] =
    useState<CompletionFilter>("active");
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const selectedCategoryId = useCategoryStore((s) => s.selectedCategoryId);
  const resetCategory = useCategoryStore((s) => s.resetCategory);
  const setCategory = useCategoryStore((s) => s.setCategory);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  const visibleCategories = categories.filter(
    (category) =>
      selectedCategoryId === null || category.id === selectedCategoryId,
  );
  const filteredTodos = filterTodosByCompletion(todos, completionFilter);

  return (
    <div className="flex w-full flex-col gap-6 border-t border-zinc-200 pt-6 md:flex-row md:items-start">
      <Sidebar childrenClassName="hidden md:flex">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-3">
            <h2 className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
              카테고리
            </h2>
            <CategoryManagementButton categories={categories} />
          </div>
          <CategoryList
            selectedCategoryId={selectedCategoryId}
            resetCategory={resetCategory}
            categories={categories}
            setCategory={setCategory}
          />
          <CreateCategoryButton />
        </div>

        <div className="border-t border-zinc-200" />

        <div className="flex flex-col gap-1">
          <h2 className="px-3 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
            완료 상태
          </h2>
          <div className="flex flex-col gap-0.5" aria-label="완료 상태 필터">
            {COMPLETION_FILTERS.map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={clsx(
                  "w-full rounded-lg px-3 py-1.5 text-left text-sm focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none",
                  completionFilter === value
                    ? "bg-brand-50 font-semibold text-brand-700"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                )}
                onClick={() => setCompletionFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </Sidebar>

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTodoToolbar
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          completionFilter={completionFilter}
          onApplyFilters={(categoryId, completion) => {
            if (categoryId === null) resetCategory();
            else setCategory(categoryId);
            setCompletionFilter(completion);
          }}
        />
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
              (todo) =>
                todo.category_id === category.id,
            );

            return (
              <TodosByCategory
                key={category.id}
                category={category}
                isEmpty={categoryTodos.length === 0}
              >
                {categoryTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    isEditing={editingTodoId === todo.id}
                    onEdit={() => setEditingTodoId(todo.id)}
                    onCancelEdit={() => setEditingTodoId(null)}
                  />
                ))}
              </TodosByCategory>
            );
          })
        )}
      </div>
    </div>
  );
}
