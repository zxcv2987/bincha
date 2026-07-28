"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { reorderCategoriesAction } from "@/features/category/category.actions";

export default function useReorderCategories() {
  return useAsyncAction(reorderCategoriesAction);
}
