"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/features/shared/components/Dialog";
import TodoForm from "@/features/todo/components/TodoForm";
import { createTodoAction } from "@/features/todo/todo.actions";

export default function CreateTodoButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createTodoAction, {
    ok: false,
  });

  // Why: react-hooks/set-state-in-effect forbids setState in an Effect body
  // and react-hooks/refs forbids ref mutation during render, so this follows
  // React's documented render-phase state adjustment instead (state-based
  // "previous value" comparison, not a ref).
  const [prevOk, setPrevOk] = useState(state.ok);
  if (state.ok !== prevOk) {
    setPrevOk(state.ok);
    if (state.ok) setOpen(false);
  }

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

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
        <TodoForm formAction={formAction} state={state} />
      </Dialog>
    </div>
  );
}
