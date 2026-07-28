"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTaskResultAction } from "@/features/result/result.actions";

export default function useDeleteResult(onSuccess?: () => void) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (resultId: number) => {
    setPending(true);
    setError(undefined);
    const result = await deleteTaskResultAction(resultId);
    setPending(false);

    if (result.ok) {
      onSuccess?.();
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return { submit, pending, error };
}
