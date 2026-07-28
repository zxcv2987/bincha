import { CategoryType } from "@/features/category/category.types";
import { createStore } from "zustand/vanilla";

export type CategoryState = {
  categories: CategoryType[];
  selectedCategoryId: number | null;
};

export type CategoryAction = {
  setCategories: (categories: CategoryType[]) => void;
  setCategory: (categoryId: number) => void;
  resetCategory: () => void;
};

export type CategoryStore = CategoryState & CategoryAction;

export const defaultInitState: CategoryState = {
  categories: [],
  selectedCategoryId: null,
};

export const initCategoryStore = (): CategoryState => {
  return { categories: [], selectedCategoryId: null };
};

export const createCategoryStore = (
  initState: CategoryState = defaultInitState,
) => {
  return createStore<CategoryStore>()((set) => ({
    ...initState,
    setCategories: (categories) => set(() => ({ categories: categories })),
    setCategory: (selectedCategoryId) => set(() => ({ selectedCategoryId })),
    resetCategory: () => set(() => ({ selectedCategoryId: null })),
  }));
};
