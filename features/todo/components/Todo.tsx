"use client";

import { TodoType } from "@/features/todo/types";
import Content from "@/features/shared/components/Content";
import TodoMoreActionButton from "@/features/todo/components/TodoMoreActionButton";
import { toggleTodoCompletedAction } from "@/features/todo/todo.actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ResultModalButton from "@/features/result/components/ResultModalButton";

export default function Todo({ todo }: { todo: TodoType }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();

  const toggleCompleted = () => {
    setError(undefined);
    startTransition(async () => {
      const result = await toggleTodoCompletedAction(todo.id);
      if (result.ok) router.refresh();
      else setError(result.error);
    });
  };

  return (
    <div
      key={todo.id}
      className="flex h-auto w-full items-start rounded-xl bg-zinc-50 p-4 text-xl font-medium text-zinc-700"
    >
      <input
        type="checkbox"
        aria-label={`${todo.title || "제목 없음"} 완료 상태`}
        checked={todo.completed}
        disabled={isPending}
        onChange={toggleCompleted}
        className="mt-1 mr-3 size-5 shrink-0 accent-brand-600"
      />
      <div className="flex w-full flex-row items-center bg-zinc-50">
        <div className="flex w-full flex-col gap-2">
          <h3 className="w-full truncate text-lg font-bold break-words">
            {todo.title.trim() || "제목 없음"}
          </h3>
          {todo.text.trim() ? (
            <span className="w-full pl-1 text-base break-words">
              <Content content={todo.text} />
            </span>
          ) : (
            <span className="w-full pl-1 text-base text-zinc-400">
              내용 없음
            </span>
          )}
          {todo.completed && todo.completed_at && (
            <span className="w-full pl-1 text-sm text-zinc-500">
              완료: {new Date(todo.completed_at).toLocaleDateString("ko-KR")}
            </span>
          )}
          {error && (
            <span className="w-full pl-1 text-xs text-red-400">{error}</span>
          )}
          {todo.completed && (
            <div className="flex items-center gap-2 pl-1 text-sm text-zinc-500">
              <span>{todo.result ? "결과 기록됨" : "결과 기록 대기"}</span>
              <ResultModalButton todo={todo} />
            </div>
          )}
        </div>
      </div>
      <TodoMoreActionButton todo={todo} />
    </div>
  );
}
