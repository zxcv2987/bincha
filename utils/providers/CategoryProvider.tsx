"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { useStore } from "zustand";

import {
  type CategoryStore,
  createCategoryStore,
  initCategoryStore,
} from "@/utils/stores/CategoryStore";

export type CategoryStoreApi = ReturnType<typeof createCategoryStore>;

export const CategoryStoreContext = createContext<CategoryStoreApi | undefined>(
  undefined,
);

export const CategoryStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const storeRef = useRef<CategoryStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createCategoryStore(initCategoryStore());
  }

  return (
    <CategoryStoreContext.Provider value={storeRef.current}>
      {children}
    </CategoryStoreContext.Provider>
  );
};

export const useCategoryStore = <T,>(
  selector: (store: CategoryStore) => T,
): T => {
  const categoryStoreContext = useContext(CategoryStoreContext);

  if (!categoryStoreContext) {
    throw new Error(`Store must be used within Provider`);
  }

  return useStore(categoryStoreContext, selector);
};
