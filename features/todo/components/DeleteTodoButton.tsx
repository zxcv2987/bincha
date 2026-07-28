"use client";

import clsx from "clsx";
import useDeleteTodo from "@/features/todo/hooks/useDeleteTodo";

export default function DeleteTodoButton({
  todoId,
  setIsLoading,
  hasResult = false,
}: {
  todoId: number;
  setIsLoading: (isLoading: boolean) => void;
  hasResult?: boolean;
}) {
  const { submit, pending, error } = useDeleteTodo();

  return (
    <>
      <button
        className={clsx(
          "btn",
          "text-red-500",
          pending ? "cursor-not-allowed opacity-50" : "",
        )}
        disabled={pending}
        onClick={async () => {
          if (
            hasResult &&
            !confirm("이 할 일과 연결된 결과 기록도 함께 삭제됩니다. 계속할까요?")
          ) {
            return;
          }
          setIsLoading(true);
          await submit(todoId);
          setIsLoading(false);
        }}
      >
        {pending ? "삭제 중..." : "할 일 삭제"}
      </button>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </>
  );
}
