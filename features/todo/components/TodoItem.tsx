"use client";

import { TodoType } from "@/features/todo/todo.types";
import LinkifiedText from "@/features/shared/components/LinkifiedText";
import TodoActionsMenu from "@/features/todo/components/TodoActionsMenu";
import useToggleTodo from "@/features/todo/hooks/useToggleTodo";
import clsx from "clsx";
import ResultModalButton from "@/features/result/components/ResultModalButton";

export default function TodoItem({ todo }: { todo: TodoType }) {
  const { submit, pending, error } = useToggleTodo();

  return (
    <div
      key={todo.id}
      className="flex w-full items-start gap-3 px-3 py-2.5 hover:bg-zinc-50"
    >
      <label className="flex shrink-0 cursor-pointer items-center pt-0.5">
        <input
          type="checkbox"
          aria-label={`${todo.title || "제목 없음"} 완료 상태`}
          checked={todo.completed}
          disabled={pending}
          onChange={() => submit(todo.id)}
          className="peer sr-only"
        />
        <span
          className={clsx(
            "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2",
            "peer-disabled:opacity-50",
            todo.completed
              ? "border-brand-600 bg-brand-600"
              : "border-zinc-300 bg-white",
          )}
        >
          <svg
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className={clsx(
              "size-3 text-white transition-transform",
              todo.completed ? "scale-100" : "scale-0",
            )}
          >
            <path
              d="M3 8.5 L6.5 12 L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <h3 className="w-full truncate text-sm font-semibold break-words text-zinc-700">
          {todo.title.trim() || "제목 없음"}
        </h3>
        {todo.text.trim() ? (
          <span className="w-full text-sm break-words text-zinc-500">
            <LinkifiedText content={todo.text} />
          </span>
        ) : (
          <span className="w-full text-sm text-zinc-400">내용 없음</span>
        )}
        {todo.completed && todo.completed_at && (
          <span className="w-full text-xs text-zinc-400">
            완료: {new Date(todo.completed_at).toLocaleDateString("ko-KR")}
          </span>
        )}
        {error && <span className="w-full text-xs text-red-400">{error}</span>}
        {todo.completed && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{todo.result ? "결과 기록됨" : "결과 기록 대기"}</span>
            <ResultModalButton todo={todo} />
          </div>
        )}
      </div>

      <TodoActionsMenu todo={todo} />
    </div>
  );
}
