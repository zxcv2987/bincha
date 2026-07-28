"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { deleteTodoAction } from "@/features/todo/todo.actions";

export default function useDeleteTodo(onSuccess?: () => void) {
  return useAsyncAction(deleteTodoAction, { onSuccess });
}
