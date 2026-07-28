"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { toggleTodoCompletedAction } from "@/features/todo/todo.actions";

export default function useToggleTodo() {
  return useAsyncAction(toggleTodoCompletedAction);
}
