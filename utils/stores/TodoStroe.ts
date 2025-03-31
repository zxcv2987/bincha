// src/stores/counter-store.ts
import { TodoType } from "@/types/todos";
import { createStore } from "zustand/vanilla";

export type TodoState = {
  todos: TodoType[] | null;
};

export type TodoActions = {
  setTodos: (todos: TodoType[]) => void;
};

export type TodoStore = TodoState & TodoActions;

export const defaultInitState: TodoState = {
  todos: null,
};

export const initTodoStore = (): TodoState => {
  return { todos: null };
};

export const createTodoStore = (initState: TodoState = defaultInitState) => {
  return createStore<TodoStore>()((set) => ({
    ...initState,
    setTodos: (todos) => set(() => ({ todos: todos })),
  }));
};
