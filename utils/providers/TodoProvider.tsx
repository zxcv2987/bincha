"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  initTodoStore,
  TodoStore,
  createTodoStore,
} from "@/utils/stores/TodoStore";

export type TodoStoreApi = ReturnType<typeof createTodoStore>;

export const TodoStoreContext = createContext<TodoStoreApi | undefined>(
  undefined,
);

export const TodoStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<TodoStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createTodoStore(initTodoStore());
  }

  return (
    <TodoStoreContext.Provider value={storeRef.current}>
      {children}
    </TodoStoreContext.Provider>
  );
};

export const useTodoStore = <T,>(selector: (store: TodoStore) => T): T => {
  const todoStoreContext = useContext(TodoStoreContext);

  if (!todoStoreContext) {
    throw new Error(`Store must be used within Provider`);
  }

  return useStore(todoStoreContext, selector);
};
