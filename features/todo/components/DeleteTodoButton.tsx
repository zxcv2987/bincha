"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { deleteTodoAction } from "@/features/todo/todo.actions";

export default function DeleteTodoButton({
  todoId,
  setIsLoading,
  hasResult = false,
}: {
  todoId: number;
  setIsLoading: (isLoading: boolean) => void;
  hasResult?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  return (
    <>
      <button
        className={clsx(
          "btn",
          "text-red-500",
          isPending ? "cursor-not-allowed opacity-50" : "",
        )}
        disabled={isPending}
        onClick={() => {
          if (
            hasResult &&
            !confirm("이 할 일과 연결된 결과 기록도 함께 삭제됩니다. 계속할까요?")
          ) {
            return;
          }
          setError(undefined);
          setIsLoading(true);

          startTransition(async () => {
            try {
              const res = await deleteTodoAction({ ok: false }, todoId);
              if (res.ok) {
                router.refresh();
              } else {
                setError("삭제에 실패했습니다. 다시 시도해 주세요.");
              }
            } finally {
              setIsLoading(false);
            }
          });
        }}
      >
        {isPending ? "삭제 중..." : "할 일 삭제"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </>
  );
}
