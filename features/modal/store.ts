import { createStore } from "zustand/vanilla";
import { TodoType } from "@/features/todo/types";

export type ModalState = {
  openModal: string | null;
  isOpen: boolean;
  editingTodo: TodoType | null;
};

export type ModalAction = {
  open: (modalId: string, options?: { todo?: TodoType }) => void;
  close: () => void;
};

export type ModalStore = ModalState & ModalAction;

export const defaultInitState: ModalState = {
  openModal: null,
  isOpen: false,
  editingTodo: null,
};

export const initModalStore = (): ModalState => {
  return { openModal: null, isOpen: false, editingTodo: null };
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    open: (openModal, options) =>
      set(() => ({
        openModal,
        isOpen: true,
        editingTodo: options?.todo ?? null,
      })),
    close: () =>
      set(() => ({ openModal: null, isOpen: false, editingTodo: null })),
  }));
};
