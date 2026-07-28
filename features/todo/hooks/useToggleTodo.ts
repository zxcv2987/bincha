"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleTodoCompletedAction } from "@/features/todo/todo.actions";

export default function useToggleTodo() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (todoId: number) => {
    setPending(true);
    setError(undefined);
    const result = await toggleTodoCompletedAction(todoId);
    setPending(false);

    if (result.ok) {
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return { submit, pending, error };
}
