"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTodoAction, TodoInput } from "@/features/todo/todo.actions";

export default function useCreateTodo(onSuccess: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<{ title?: string; categoryId?: string }>();

  const submit = async (input: TodoInput) => {
    setPending(true);
    const result = await createTodoAction(input);
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
