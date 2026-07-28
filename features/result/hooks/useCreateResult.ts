"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createTaskResultAction } from "@/features/result/result.actions";

export default function useCreateResult(onSuccess: () => void) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createTaskResultAction, {
    ok: false,
  });

  // ref는 렌더 중이 아니라 effect 안에서만 써야 하므로(react-hooks/refs),
  // "최신 onSuccess를 담아두는" effect를 별도로 둔다.
  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  });

  // useActionState의 state는 dispatch마다 새 객체 참조로 바뀌므로, ok:true가
  // 연달아 나와도(같은 폼을 다시 성공적으로 제출) 매번 정확히 감지된다.
  // state.ok 값만 의존성에 넣으면 true→true 전환을 놓친다.
  useEffect(() => {
    if (state.ok) {
      onSuccessRef.current();
      router.refresh();
    }
  }, [state, router]);

  return { state, formAction, pending };
}
