"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dialog from "@/features/shared/components/Dialog";
import ResultForm from "@/features/result/components/ResultForm";
import {
  createTaskResultAction,
  updateTaskResultAction,
} from "@/features/result/result.actions";
import { TodoType } from "@/features/todo/types";

export default function ResultModalButton({ todo }: { todo: TodoType }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const hasResult = Boolean(todo.result);
  const action = hasResult ? updateTaskResultAction : createTaskResultAction;
  const [state, formAction, pending] = useActionState(action, { ok: false });

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
    <>
      <button
        type="button"
        className="btn w-auto text-sm"
        onClick={() => setOpen(true)}
      >
        {hasResult ? "결과 보기" : "결과 기록"}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={hasResult ? "실행 결과 보기" : "실행 결과 기록"}
      >
        <ResultForm
          todo={todo}
          state={state}
          formAction={formAction}
          pending={pending}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
