"use client";

import { TodoType } from "@/types/todos";
import useModal from "@/utils/hooks/useModal";
import DeleteTodoButton from "@/components/todoList/DeleteTodoButton";
import Content from "@/components/common/Content";
import EditTodoList from "./EditTodoList";
import { CategoryType } from "@/types/category";

export default function Todo({
  todo,
  categories,
}: {
  todo: TodoType;
  categories: CategoryType[];
}) {
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
    <div
      key={todo.id}
      className="flex h-auto w-full flex-row items-start justify-between rounded-xl bg-zinc-50 p-6 text-xl font-medium text-zinc-700"
    >
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-col gap-2">
          <h3 className="w-full truncate text-lg font-bold break-words">
            {todo.title}
          </h3>
          <span className="w-full truncate pl-2 text-base break-words">
            <Content content={todo.text} />
          </span>
        </div>
      </div>
      <div className="relative flex w-full items-center justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg px-3 py-1 text-lg hover:bg-zinc-200"
        >
          ⋮
        </button>
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute right-1 -bottom-14 z-10 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
          >
            <DeleteTodoButton todoId={todo.id} />
            <EditTodoList todo={todo} categories={categories} />
          </div>
        )}
      </div>
    </div>
  );
}
