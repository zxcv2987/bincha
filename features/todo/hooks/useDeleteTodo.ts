"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTodoAction } from "@/features/todo/todo.actions";

export default function useDeleteTodo(onSuccess?: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (todoId: number) => {
    setPending(true);
    setError(undefined);
    const result = await deleteTodoAction(todoId);
    setPending(false);

    if (result.ok) {
      onSuccess?.();
      router.refresh();
    } else {
      setError("삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return { submit, pending, error };
}
