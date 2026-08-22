"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createMemoAction } from "@/features/memo/memo.actions";

export default function useCreateMemo(onSuccess?: () => void) {
  return useAsyncAction(createMemoAction, { onSuccess });
}
