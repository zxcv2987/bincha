"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { deleteTodoAction } from "@/actions/todo";

export default function DeleteTodoButton({ todoId }: { todoId: number }) {
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
        startTransition(async () => {
          const res = await deleteTodoAction({ ok: false }, todoId);
          if (res.ok) {
            router.refresh();
          } else {
            alert("삭제 실패");
          }
        });
      }}
    >
      {isPending ? "삭제 중..." : "할 일 삭제"}
    </button>
  );
}
