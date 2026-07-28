"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { deleteCategoryAction } from "@/features/category/category.actions";

export default function useDeleteCategory(onSuccess?: () => void) {
  return useAsyncAction(deleteCategoryAction, { onSuccess });
}
