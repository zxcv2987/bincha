"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTodoAction, TodoInput } from "@/features/todo/todo.actions";

export default function useUpdateTodo(todoId: number, onSuccess: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ title?: string; categoryId?: string }>();

  const submit = async (input: TodoInput) => {
    setPending(true);
    const result = await updateTodoAction(todoId, input);
    setPending(false);

    if (result.ok) {
      onSuccess();
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return { submit, pending, error };
}
