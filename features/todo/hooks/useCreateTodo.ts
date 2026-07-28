"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createTodoAction } from "@/features/todo/todo.actions";

export default function useCreateTodo(onSuccess: () => void) {
  return useAsyncAction(createTodoAction, { onSuccess });
}
