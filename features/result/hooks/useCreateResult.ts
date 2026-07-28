"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createTaskResultAction } from "@/features/result/result.actions";

export default function useCreateResult(onSuccess: () => void) {
  return useAsyncAction(createTaskResultAction, { onSuccess });
}
