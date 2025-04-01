// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

export type ModalState = {
  openModal: string | null;
  isOpen: boolean;
};

export type ModalAction = {
  open: (modalId: string) => void;
  close: () => void;
};

export type ModalStore = ModalState & ModalAction;

export const defaultInitState: ModalState = {
  openModal: null,
  isOpen: false,
};

export const initModalStore = (): ModalState => {
  return { openModal: null, isOpen: false };
};

export const createModalStore = (initState: ModalState = defaultInitState) => {
  return createStore<ModalStore>()((set) => ({
    ...initState,
    open: (openModal) => set(() => ({ openModal: openModal, isOpen: true })),
    close: () => set(() => ({ openModal: null, isOpen: false })),
  }));
};
