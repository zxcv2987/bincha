"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateTaskResultAction } from "@/features/result/result.actions";

export default function useUpdateResult(onSuccess: () => void) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateTaskResultAction, {
    ok: false,
  });

  // ref는 렌더 중이 아니라 effect 안에서만 써야 하므로(react-hooks/refs),
  // "최신 onSuccess를 담아두는" effect를 별도로 둔다.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  useEffect(() => {
    if (state.ok) {
      onSuccessRef.current();
      router.refresh();
    }
  }, [state, router]);

  return { state, formAction, pending };
}
