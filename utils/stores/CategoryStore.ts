// src/stores/counter-store.ts
import { CategoryType } from "@/types/category";
import { createStore } from "zustand/vanilla";

export type CategoryState = {
  categories: CategoryType[];
  categoryState: string | null;
};

export type CategoryAction = {
  setCategories: (categories: CategoryType[]) => void;
  setCategory: (modalId: string) => void;
  resetCategory: () => void;
};

export type CategoryStore = CategoryState & CategoryAction;

export const defaultInitState: CategoryState = {
  categories: [],
  categoryState: null,
};

export const initCategoryStore = (): CategoryState => {
  return { categories: [], categoryState: null };
};

export const createCategoryStore = (
  initState: CategoryState = defaultInitState,
) => {
  return createStore<CategoryStore>()((set) => ({
    ...initState,
    setCategories: (categories) => set(() => ({ categories: categories })),
    setCategory: (categoryState) =>
      set(() => ({ categoryState: categoryState })),
    resetCategory: () => set(() => ({ categoryState: null })),
  }));
};
