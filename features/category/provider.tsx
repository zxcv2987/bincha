"use client";

import { type ReactNode, createContext, useContext, useState } from "react";
import { useStore } from "zustand";

import {
  type CategoryStore,
  createCategoryStore,
  initCategoryStore,
} from "@/features/category/store";

export type CategoryStoreApi = ReturnType<typeof createCategoryStore>;

export const CategoryStoreContext = createContext<CategoryStoreApi | undefined>(
  undefined,
);

export const CategoryStoreProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [store] = useState(() =>
    createCategoryStore(initCategoryStore()),
  );

  return (
    <CategoryStoreContext.Provider value={store}>
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
