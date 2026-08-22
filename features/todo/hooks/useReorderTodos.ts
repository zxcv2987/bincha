"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { reorderTodosAction } from "@/features/todo/todo.actions";

export default function useReorderTodos() {
  return useAsyncAction(reorderTodosAction);
}
