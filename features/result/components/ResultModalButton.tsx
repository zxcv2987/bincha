"use client";

import { useModalStore } from "@/features/modal/provider";
import { TodoType } from "@/features/todo/types";

export default function ResultModalButton({ todo }: { todo: TodoType }) {
  const open = useModalStore((state) => state.open);
  const hasResult = Boolean(todo.result);

  return (
    <button
      type="button"
      className="btn w-auto text-sm"
      onClick={() => open(hasResult ? "updateResult" : "result", { todo })}
    >
      {hasResult ? "결과 보기" : "결과 기록"}
    </button>
  );
}
