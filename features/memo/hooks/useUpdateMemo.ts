"use client";

import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { MemoInput, updateMemoAction } from "@/features/memo/memo.actions";

export default function useUpdateMemo(memoId: number, onSuccess: () => void) {
  return useAsyncAction(
    (input: MemoInput) => updateMemoAction(memoId, input),
    { onSuccess },
  );
}
