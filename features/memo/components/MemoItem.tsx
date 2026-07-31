"use client";

import { MemoType } from "@/features/memo/memo.types";
import LinkifiedText from "@/features/shared/components/LinkifiedText";
import MemoForm from "@/features/memo/components/MemoForm";
import useUpdateMemo from "@/features/memo/hooks/useUpdateMemo";
import useDeleteMemo from "@/features/memo/hooks/useDeleteMemo";
import { useEffect, useRef, useState } from "react";

const UNDO_DELAY_MS = 5000;

function memoPreview(content: string) {
  const trimmed = content.trim();
  if (trimmed.length <= 40) return trimmed;
  return `${trimmed.slice(0, 40)}…`;
}

const editActionClassName =
  "flex h-11 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50";

const deleteActionClassName =
  "flex h-11 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-semibold text-red-600 transition-opacity hover:bg-zinc-100 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50 [@media(hover:hover)_and_(pointer:fine)]:opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:focus-visible:opacity-100";

export default function MemoItem({
  memo,
  isEditing,
  onEdit,
  onCancelEdit,
}: {
  memo: MemoType;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}) {
  const {
    submit: updateMemo,
    pending: updatePending,
    error: updateError,
    fieldErrors,
  } = useUpdateMemo(memo.id, onCancelEdit);
  const {
    submit: deleteMemo,
    pending: deletePending,
    error: deleteError,
  } = useDeleteMemo();

  const [isDeleting, setIsDeleting] = useState(false);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const undoButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isDeleting) undoButtonRef.current?.focus();
  }, [isDeleting]);

  useEffect(() => () => clearTimeout(undoTimeoutRef.current), []);

  const handleDeleteClick = () => {
    setIsDeleting(true);
    undoTimeoutRef.current = setTimeout(async () => {
      const result = await deleteMemo(memo.id);
      if (result && !result.ok) {
        setIsDeleting(false);
      }
    }, UNDO_DELAY_MS);
  };

  const handleUndo = () => {
    clearTimeout(undoTimeoutRef.current);
    setIsDeleting(false);
  };

  if (isEditing) {
    return (
      <div className="w-full px-3 py-2.5">
        <MemoForm
          memo={memo}
          pending={updatePending}
          error={updateError}
          fieldErrors={fieldErrors}
          onSubmit={updateMemo}
          onCancel={onCancelEdit}
          compact
          className="w-full"
          autoFocus
        />
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div
        role="status"
        className="flex w-full items-center justify-between gap-3 px-3 py-2.5"
      >
        <p className="min-w-0 truncate text-sm text-zinc-500">
          {deletePending
            ? "삭제하는 중..."
            : `"${memoPreview(memo.content)}" 삭제 예정`}
        </p>
        <button
          ref={undoButtonRef}
          type="button"
          onClick={handleUndo}
          disabled={deletePending}
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none disabled:opacity-50"
        >
          실행 취소
        </button>
      </div>
    );
  }

  return (
    <div className="group flex w-full flex-col px-3 py-2.5 hover:bg-zinc-50">
      <div className="flex w-full items-start gap-2">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
          <div className="w-full text-sm break-words text-zinc-700">
            <LinkifiedText content={memo.content} />
          </div>
          {memo.link.trim() && (
            <div className="w-full text-sm break-words text-zinc-500">
              <LinkifiedText content={memo.link} />
            </div>
          )}
          <span className="w-full text-xs text-zinc-500">
            {new Date(memo.created_at).toLocaleDateString("ko-KR", {
              timeZone: "Asia/Seoul",
            })}
          </span>
        </div>

        <div className="flex shrink-0 self-center gap-0.5">
          <button
            type="button"
            aria-label="메모 수정"
            onClick={onEdit}
            className={editActionClassName}
          >
            수정
          </button>
          <button
            type="button"
            aria-label="메모 삭제"
            onClick={handleDeleteClick}
            className={deleteActionClassName}
          >
            삭제
          </button>
        </div>
      </div>
      {deleteError && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {deleteError}
        </p>
      )}
    </div>
  );
}
