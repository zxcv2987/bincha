"use client";

import { TodoType } from "@/features/todo/todo.types";
import LinkifiedText from "@/features/shared/components/LinkifiedText";
import TodoForm from "@/features/todo/components/TodoForm";
import useToggleTodo from "@/features/todo/hooks/useToggleTodo";
import useUpdateTodo from "@/features/todo/hooks/useUpdateTodo";
import useDeleteTodo from "@/features/todo/hooks/useDeleteTodo";
import clsx from "clsx";
import ResultModalButton from "@/features/result/components/ResultModalButton";
import { useSortable } from "@dnd-kit/react/sortable";

export default function TodoItem({
  todo,
  index,
  instructionsId,
  reorderPending,
  isEditing,
  onEdit,
  onCancelEdit,
  onSetCompletion,
  onCompletionError,
}: {
  todo: TodoType;
  index: number;
  instructionsId: string;
  reorderPending: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSetCompletion: (
    todoId: number,
    completed: boolean,
    completedAt: Date | null,
  ) => void;
  onCompletionError: (message: string | null) => void;
}) {
  const { submit: toggleComplete, pending: togglePending } = useToggleTodo();
  const { submit: updateTodo, pending: updatePending, fieldErrors } =
    useUpdateTodo(todo.id, onCancelEdit);
  const { submit: deleteTodo, pending: deletePending } = useDeleteTodo();
  const { ref, isDragging } = useSortable({
    id: todo.id,
    index,
    disabled: isEditing || reorderPending,
  });

  // 행 안의 실제 인터랙티브 요소(체크박스/삭제·결과 버튼/링크)를 눌렀을 때는
  // 수정 진입으로 처리하지 않는다. 그 외 영역 클릭만 수정으로 인식한다.
  const isInteractiveTarget = (target: EventTarget | null) =>
    target instanceof Element &&
    target.closest("input, button, a, label, [contenteditable]") !== null;

  const handleRowClick = (event: React.MouseEvent) => {
    if (isInteractiveTarget(event.target)) return;
    onEdit();
  };

  const handleRowKeyDown = (event: React.KeyboardEvent) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onEdit();
    }
  };

  // 완료 상태를 낙관적으로 먼저 바꾸고, 서버 요청이 실패하면 이전 값으로 되돌린다.
  const handleToggle = async () => {
    onCompletionError(null);
    const previousCompleted = todo.completed;
    const previousCompletedAt = todo.completed_at;
    const nextCompleted = !previousCompleted;
    onSetCompletion(todo.id, nextCompleted, nextCompleted ? new Date() : null);
    const result = await toggleComplete(todo.id);
    if (result && !result.ok) {
      onSetCompletion(todo.id, previousCompleted, previousCompletedAt);
      onCompletionError(result.error ?? "완료 상태를 변경하지 못했습니다.");
    }
  };

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
        ref={ref}
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
      ref={ref}
      role="button"
      tabIndex={0}
      aria-label={`${todo.title || "제목 없음"} 수정. 드래그하여 순서 변경`}
      aria-describedby={instructionsId}
      onClick={handleRowClick}
      onKeyDown={handleRowKeyDown}
      className={clsx(
        "group flex w-full cursor-pointer items-start gap-2 px-3 py-2.5 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none",
        isDragging && "z-10 cursor-grabbing bg-white opacity-70 shadow-lg",
      )}
    >
      <label className="flex shrink-0 cursor-pointer items-center pt-0.5">
        <input
          type="checkbox"
          aria-label={`${todo.title || "제목 없음"} 완료 상태`}
          checked={todo.completed}
          disabled={togglePending}
          onChange={handleToggle}
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

      <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
        <h3 className="w-full truncate text-base font-semibold break-words text-zinc-700">
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
        className="flex size-11 shrink-0 self-center items-center justify-center rounded-lg text-zinc-500 transition-opacity hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:focus-visible:opacity-100"
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
