"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { deleteMemoAction } from "@/features/memo/memo.actions";

export default function useDeleteMemo(onSuccess?: () => void) {
  return useAsyncAction(deleteMemoAction, { onSuccess });
}
