"use client";

import { CategoryType } from "@/features/category/category.types";
import { TodoType } from "@/features/todo/todo.types";
import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import Sidebar from "@/features/shared/components/Sidebar";
import TodosByCategory from "@/features/shared/components/TodosByCategory";
import CreateTodoButton from "@/features/todo/components/CreateTodoButton";
import TodoItem from "@/features/todo/components/TodoItem";
import { useCategoryStore } from "@/features/category/provider";
import CategoryList from "@/features/category/components/CategoryList";
import CreateCategoryButton from "@/features/category/components/CreateCategoryButton";
import EmptyCard from "@/features/shared/components/EmptyCard";
import CategoryManagementButton from "@/features/category/components/CategoryManagementButton";
import MobileTodoToolbar from "@/features/todo/components/MobileTodoToolbar";
import useReorderTodos from "@/features/todo/hooks/useReorderTodos";
import {
  COMPLETION_FILTERS,
  CompletionFilter,
  filterTodosByCompletion,
} from "@/features/todo/todoFilters";

function mergeVisibleOrder(all: TodoType[], nextVisible: TodoType[]) {
  const visibleIds = new Set(nextVisible.map((todo) => todo.id));
  const queue = [...nextVisible];
  return all.map((todo) =>
    visibleIds.has(todo.id) ? queue.shift()! : todo,
  );
}

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
  const [orderedTodos, setOrderedTodos] = useState(todos);
  const [prevTodos, setPrevTodos] = useState(todos);
  const instructionsId = useId();
  const reorder = useReorderTodos();
  const setCategories = useCategoryStore((s) => s.setCategories);
  const selectedCategoryId = useCategoryStore((s) => s.selectedCategoryId);
  const resetCategory = useCategoryStore((s) => s.resetCategory);
  const setCategory = useCategoryStore((s) => s.setCategory);

  useEffect(() => {
    setCategories(categories);
  }, [categories, setCategories]);

  // 서버에서 새 todos가 내려오면(재검증 등) 로컬 낙관적 순서를 최신 값으로 맞춘다.
  // 렌더 도중 조정해 불필요한 effect 왕복을 피한다.
  if (todos !== prevTodos) {
    setPrevTodos(todos);
    setOrderedTodos(todos);
  }

  const visibleCategories = categories.filter(
    (category) =>
      selectedCategoryId === null || category.id === selectedCategoryId,
  );
  const filteredTodos = filterTodosByCompletion(orderedTodos, completionFilter);

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
        <p id={instructionsId} className="sr-only">
          순서 변경 버튼에 초점을 둔 뒤 Enter 또는 Space를 누르고, 방향키로
          이동한 다음 다시 Enter 또는 Space를 눌러 완료하세요.
        </p>
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
          <EmptyCard
            message={
              todos.length === 0
                ? "할 일을 추가해 보세요."
                : "선택한 상태의 할 일이 없습니다."
            }
          />
        ) : visibleCategories.length === 0 ? (
          <EmptyCard message="선택한 카테고리에 할 일이 없습니다." />
        ) : (
          visibleCategories.map((category) => {
            const categoryTodos = orderedTodos.filter(
              (todo) => todo.category_id === category.id,
            );
            const categoryVisibleTodos = filterTodosByCompletion(
              categoryTodos,
              completionFilter,
            );

            return (
              <TodosByCategory
                key={category.id}
                category={category}
                isEmpty={categoryVisibleTodos.length === 0}
              >
                <DragDropProvider
                  onDragEnd={async (event) => {
                    if (event.canceled || reorder.pending) return;
                    const nextVisible = move(categoryVisibleTodos, event);
                    if (
                      nextVisible.every(
                        (todo, index) =>
                          todo.id === categoryVisibleTodos[index]?.id,
                      )
                    ) {
                      return;
                    }

                    const nextCategory = mergeVisibleOrder(
                      categoryTodos,
                      nextVisible,
                    ).map((todo, index) => ({
                      ...todo,
                      sort_order: index,
                    }));
                    const previous = orderedTodos;
                    setOrderedTodos([
                      ...orderedTodos.filter(
                        (todo) => todo.category_id !== category.id,
                      ),
                      ...nextCategory,
                    ]);

                    const result = await reorder.submit(
                      category.id,
                      nextCategory.map(({ id }) => id),
                    );
                    if (!result?.ok) setOrderedTodos(previous);
                  }}
                >
                  {categoryVisibleTodos.map((todo, index) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      index={index}
                      instructionsId={instructionsId}
                      reorderPending={reorder.pending}
                      isEditing={editingTodoId === todo.id}
                      onEdit={() => setEditingTodoId(todo.id)}
                      onCancelEdit={() => setEditingTodoId(null)}
                    />
                  ))}
                </DragDropProvider>
              </TodosByCategory>
            );
          })
        )}
        {reorder.error && (
          <p role="alert" className="px-1 pt-2 text-sm text-red-600">
            {reorder.error}
          </p>
        )}
      </div>
    </div>
  );
}
