"use client";
import { updateTodo } from "@/apis/todo";
import { TodoType } from "@/types/todos";
import useModal from "@/utils/hooks/useModal";
import clsx from "clsx";
import { useOptimistic, useState, useTransition } from "react";
import DeleteTodoButton from "@/components/todoList/DeleteTodoButton";

export default function Todo({ todo }: { todo: TodoType }) {
  const [todoState, setTodoState] = useState(todo);
  const [optimisticState, addOptimisticState] = useOptimistic(
    todoState,
    (_, newState: TodoType) => newState,
  );
  const [, startTransition] = useTransition();
  const { isOpen, setIsOpen, modalRef } = useModal();
  return (
    <div
      key={todoState.id}
      className="flex h-auto w-full flex-row items-start justify-between rounded-xl p-4 text-xl font-medium hover:bg-zinc-100"
    >
      <div
        className="flex w-full cursor-pointer flex-row items-center gap-4"
        onClick={() => {
          startTransition(async () => {
            addOptimisticState({
              ...todoState,
              completed: !todoState.completed,
            });
            const newTodo: TodoType = await updateTodo({
              ...todoState,
              completed: !todoState.completed,
            });
            console.log(newTodo);
            startTransition(() => {
              setTodoState(newTodo);
            });
          });
        }}
      >
        <button
          className={clsx(
            "flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-transform duration-200",
            optimisticState.completed
              ? "scale-100"
              : "border border-zinc-300 opacity-100",
          )}
        >
          {optimisticState.completed && <span className="checkmark">✔</span>}
        </button>

        <div className="flex w-full flex-col">
          <h3 className="w-full truncate text-lg font-bold break-words text-zinc-700">
            {optimisticState.title}
          </h3>

          <p className="w-full p-2 text-base break-words whitespace-pre-wrap text-zinc-700">
            {!optimisticState.completed && optimisticState.text}
          </p>
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
            <DeleteTodoButton todoId={todoState.id} />
          </div>
        )}
      </div>
    </div>
  );
}
