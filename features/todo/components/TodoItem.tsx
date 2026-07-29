"use client";

import { TodoType } from "@/features/todo/todo.types";
import LinkifiedText from "@/features/shared/components/LinkifiedText";
import TodoForm from "@/features/todo/components/TodoForm";
import useToggleTodo from "@/features/todo/hooks/useToggleTodo";
import useUpdateTodo from "@/features/todo/hooks/useUpdateTodo";
import useDeleteTodo from "@/features/todo/hooks/useDeleteTodo";
import clsx from "clsx";
import ResultModalButton from "@/features/result/components/ResultModalButton";

export default function TodoItem({
  todo,
  isEditing,
  onEdit,
  onCancelEdit,
}: {
  todo: TodoType;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}) {
  const { submit: toggleComplete, pending: togglePending, error: toggleError } =
    useToggleTodo();
  const { submit: updateTodo, pending: updatePending, fieldErrors } =
    useUpdateTodo(todo.id, onCancelEdit);
  const { submit: deleteTodo, pending: deletePending } = useDeleteTodo();

  const handleDelete = async () => {
    const confirmMessage = todo.result
      ? "이 할 일과 연결된 결과 기록도 함께 삭제됩니다. 계속할까요?"
      : "이 할 일을 삭제할까요?";
    if (!confirm(confirmMessage)) return;
    await deleteTodo(todo.id);
  };

  if (isEditing) {
    return (
      <div
        className="w-full px-3 py-2.5"
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancelEdit();
        }}
      >
        <TodoForm
          todo={todo}
          pending={updatePending}
          fieldErrors={fieldErrors}
          onSubmit={updateTodo}
          onCancel={onCancelEdit}
          compact
          className="w-full"
          textRows={3}
        />
      </div>
    );
  }

  return (
    <div
      key={todo.id}
      className="group flex w-full items-start gap-3 px-3 py-2.5 hover:bg-zinc-50"
    >
      <label className="flex shrink-0 cursor-pointer items-center pt-0.5">
        <input
          type="checkbox"
          aria-label={`${todo.title || "제목 없음"} 완료 상태`}
          checked={todo.completed}
          disabled={togglePending}
          onChange={() => toggleComplete(todo.id)}
          className="peer sr-only outline-none"
        />
        <span
          className={clsx(
            "flex size-5 items-center justify-center rounded-full border-2 transition-colors",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 peer-focus-visible:ring-offset-2",
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

      <div
        role="button"
        tabIndex={0}
        aria-label={`${todo.title || "제목 없음"} 수정`}
        onClick={onEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onEdit();
          }
        }}
        className="flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-0.5 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
      >
        <h3 className="w-full truncate text-sm font-semibold break-words text-zinc-700">
          {todo.title.trim() || "제목 없음"}
        </h3>
        {todo.text.trim() ? (
          <span className="w-full text-sm break-words text-zinc-500">
            <LinkifiedText content={todo.text} />
          </span>
        ) : (
          <span className="w-full text-sm text-zinc-500">내용 없음</span>
        )}
        {todo.completed && todo.completed_at && (
          <span className="w-full text-xs text-zinc-500">
            완료: {new Date(todo.completed_at).toLocaleDateString("ko-KR")}
          </span>
        )}
        {toggleError && (
          <span className="w-full text-xs text-red-400">{toggleError}</span>
        )}
        {todo.completed && (
          <div
            className="flex items-center gap-2 text-xs text-zinc-500"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <span>{todo.result ? "결과 기록됨" : "결과 기록 대기"}</span>
            <ResultModalButton todo={todo} />
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={`${todo.title || "제목 없음"} 삭제`}
        onClick={handleDelete}
        disabled={deletePending}
        className="shrink-0 self-center rounded-lg p-2 text-zinc-500 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50 group-hover:opacity-100"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className="size-5"
        >
          <path
            d="M4 6h12M8 6V4.5A1.5 1.5 0 0 1 9.5 3h1A1.5 1.5 0 0 1 12 4.5V6m2 0-.6 9.6a2 2 0 0 1-2 1.9H8.6a2 2 0 0 1-2-1.9L6 6h8Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
