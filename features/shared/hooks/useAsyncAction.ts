"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 모든 mutation 서버 액션이 따르는 공통 반환 계약. 필드별 에러가 필요하면
// bespoke 타입을 새로 만들지 말고 fieldErrors를 쓴다.
export type ActionResult<Data = undefined> =
  | { ok: true; data?: Data }
  | { ok: false; error?: string; fieldErrors?: Record<string, string> };

export default function useAsyncAction<Args extends unknown[], Data>(
  action: (...args: Args) => Promise<ActionResult<Data>>,
  options: {
    onSuccess?: (data: Data | undefined) => void;
    refresh?: boolean;
  } = {},
) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<ActionResult<Data>>();

  const submit = async (...args: Args) => {
    if (pending) return;
    setPending(true);

    try {
      const result = await action(...args);
      setResult(result);
      if (result.ok) {
        options.onSuccess?.(result.data);
        if (options.refresh ?? true) router.refresh();
      }
      return result;
    } catch (error) {
      console.error(error);
      const result: ActionResult<Data> = {
        ok: false,
        error: "요청을 처리하지 못했습니다. 다시 시도해 주세요.",
      };
      setResult(result);
      return result;
    } finally {
      setPending(false);
    }
  };

  return {
    submit,
    pending,
    error: result && !result.ok ? result.error : undefined,
    fieldErrors: result && !result.ok ? result.fieldErrors : undefined,
  };
}
