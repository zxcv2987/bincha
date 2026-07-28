"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { updateTaskResultAction } from "@/features/result/result.actions";

export default function useUpdateResult(onSuccess: () => void) {
  return useAsyncAction(updateTaskResultAction, { onSuccess });
}
