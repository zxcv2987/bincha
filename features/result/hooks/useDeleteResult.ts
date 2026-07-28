"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { deleteTaskResultAction } from "@/features/result/result.actions";

export default function useDeleteResult(onSuccess?: () => void) {
  return useAsyncAction(deleteTaskResultAction, { onSuccess });
}
