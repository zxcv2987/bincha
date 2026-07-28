"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { TodoInput, updateTodoAction } from "@/features/todo/todo.actions";

export default function useUpdateTodo(todoId: number, onSuccess: () => void) {
  return useAsyncAction(
    (input: TodoInput) => updateTodoAction(todoId, input),
    { onSuccess },
  );
}
