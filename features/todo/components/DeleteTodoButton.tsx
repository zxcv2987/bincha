"use client";

import { useTransition } from "react";
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

  return (
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
        setIsLoading(true);

        startTransition(async () => {
          try {
            const res = await deleteTodoAction({ ok: false }, todoId);
            if (res.ok) {
              router.refresh();
            } else {
              alert("삭제 실패");
            }
          } finally {
            setIsLoading(false);
          }
        });
      }}
    >
      {isPending ? "삭제 중..." : "할 일 삭제"}
    </button>
  );
}
