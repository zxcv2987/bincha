"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import {
  type ModalStore,
  createModalStore,
  initModalStore,
} from "@/features/modal/store";

export type ModalStoreApi = ReturnType<typeof createModalStore>;

export const ModalStoreContext = createContext<ModalStoreApi | undefined>(
  undefined,
);

export const ModalStoreProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() => createModalStore(initModalStore()));

  return (
    <ModalStoreContext.Provider value={store}>
      {children}
    </ModalStoreContext.Provider>
  );
};

export const useModalStore = <T,>(selector: (store: ModalStore) => T): T => {
  const modalStoreContext = useContext(ModalStoreContext);

  if (!modalStoreContext) {
    throw new Error(`useModalStore must be used within ModalStoreProvider`);
  }

  return useStore(modalStoreContext, selector);
};
