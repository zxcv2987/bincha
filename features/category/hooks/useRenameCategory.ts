"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { renameCategoryAction } from "@/features/category/category.actions";
import { CategoryType } from "@/features/category/category.types";

export default function useRenameCategory(
  onSuccess: (category: CategoryType) => void,
) {
  return useAsyncAction(renameCategoryAction, {
    onSuccess: (category) => {
      if (category) onSuccess(category);
    },
  });
}
