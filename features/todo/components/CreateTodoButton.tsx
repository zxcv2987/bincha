"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import TodoForm from "@/features/todo/components/TodoForm";
import useCreateTodo from "@/features/todo/hooks/useCreateTodo";

export default function CreateTodoButton() {
  const [open, setOpen] = useState(false);
  const { submit, pending, error } = useCreateTodo(() => setOpen(false));

  return (
    <div className="pb-2">
      <button
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-brand-600 hover:bg-brand-50"
        onClick={() => setOpen(true)}
      >
        <span aria-hidden="true" className="text-base leading-none">
          +
        </span>
        할 일 추가
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="할 일 추가하기"
        disableBackdropClose={pending}
      >
        <TodoForm onSubmit={submit} pending={pending} error={error} />
      </Dialog>
    </div>
  );
}
