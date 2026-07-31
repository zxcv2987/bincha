import { MemoType } from "@/features/memo/memo.types";
import type { MemoInput } from "@/features/memo/memo.actions";
import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function MemoForm({
  memo,
  pending,
  error,
  fieldErrors,
  onSubmit,
  onCancel,
  compact = false,
  className = "w-full",
  autoFocus = false,
  variant = "default",
  initialValues,
  onFieldsChange,
  statusMessage,
}: {
  memo?: MemoType;
  pending: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  onSubmit: (input: MemoInput) => void;
  onCancel?: () => void;
  compact?: boolean;
  className?: string;
  autoFocus?: boolean;
  variant?: "default" | "quick";
  initialValues?: { content: string; link: string };
  onFieldsChange?: (values: { content: string; link: string }) => void;
  statusMessage?: string;
}) {
  const contentId = useId();
  const linkId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const isFirstRender = useRef(true);
  const baselineValues = useRef({
    content: memo?.content ?? "",
    link: memo?.link ?? "",
  });

  const hasInitialLink =
    Boolean(memo?.link?.trim()) ||
    Boolean(initialValues?.link?.trim()) ||
    Boolean(fieldErrors?.link);
  const [linkOpen, setLinkOpen] = useState(
    variant === "default" || hasInitialLink,
  );

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (linkOpen) linkInputRef.current?.focus();
  }, [linkOpen]);

  const isDirty = () => {
    const form = formRef.current;
    if (!form) return false;
    const formData = new FormData(form);
    return (
      String(formData.get("content") ?? "") !== baselineValues.current.content ||
      String(formData.get("link") ?? "") !== baselineValues.current.link
    );
  };

  const requestCancel = () => {
    if (!onCancel) return;
    if (isDirty() && !confirm("수정한 내용을 버릴까요?")) return;
    onCancel();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      formRef.current?.requestSubmit();
      return;
    }
    if (e.key === "Escape" && onCancel) {
      e.preventDefault();
      requestCancel();
    }
  };

  const emitFieldsChange = () => {
    if (!onFieldsChange) return;
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    onFieldsChange({
      content: String(formData.get("content") ?? ""),
      link: String(formData.get("link") ?? ""),
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        onSubmit({
          content: String(formData.get("content") ?? ""),
          link: String(formData.get("link") ?? ""),
        });
      }}
      onKeyDown={handleKeyDown}
      className={clsx("flex flex-col", compact ? "gap-3" : "gap-4", className)}
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={contentId}
          className={clsx(
            "text-sm font-semibold text-zinc-600",
            compact && "sr-only",
          )}
        >
          메모
        </label>
        <textarea
          id={contentId}
          name="content"
          placeholder="기억해둘 내용"
          rows={compact ? 3 : variant === "quick" ? 2 : 4}
          className={clsx("input", compact && "px-2.5 py-1.5 text-sm")}
          defaultValue={memo?.content ?? initialValues?.content}
          spellCheck={false}
          autoFocus={autoFocus}
          onChange={emitFieldsChange}
          aria-invalid={Boolean(fieldErrors?.content)}
          aria-describedby={
            fieldErrors?.content ? `${contentId}-error` : undefined
          }
        />
        {fieldErrors?.content && (
          <span id={`${contentId}-error`} className="text-xs text-red-600">
            {fieldErrors.content}
          </span>
        )}
      </div>

      {linkOpen ? (
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor={linkId}
            className={clsx(
              "text-sm font-semibold text-zinc-600",
              compact && "sr-only",
            )}
          >
            링크
          </label>
          <input
            ref={linkInputRef}
            id={linkId}
            name="link"
            type="url"
            placeholder="참고 링크 (선택)"
            className={clsx(
              "input",
              compact && "px-2.5 py-1.5 text-sm text-zinc-500",
            )}
            defaultValue={memo?.link ?? initialValues?.link}
            spellCheck={false}
            onChange={emitFieldsChange}
            aria-invalid={Boolean(fieldErrors?.link)}
            aria-describedby={fieldErrors?.link ? `${linkId}-error` : undefined}
          />
          {fieldErrors?.link && (
            <span id={`${linkId}-error`} className="text-xs text-red-600">
              {fieldErrors.link}
            </span>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setLinkOpen(true)}
          className="self-start rounded-md px-1.5 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          + 링크 추가
        </button>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          className={clsx(
            "btn btn-primary",
            (onCancel || variant === "quick") && "w-auto",
            compact && "px-6 py-3 text-sm",
          )}
          disabled={pending}
          type="submit"
        >
          <ButtonLabel
            pending={pending}
            pendingText={memo ? "수정 중..." : "추가 중..."}
          >
            {memo ? "메모 수정" : "메모 추가"}
          </ButtonLabel>
        </button>
        {onCancel && (
          <button
            type="button"
            className={clsx("btn w-auto", compact && "px-6 py-3 text-sm")}
            disabled={pending}
            onClick={requestCancel}
          >
            취소
          </button>
        )}
        {!compact && (
          <p aria-live="polite" className="text-xs text-zinc-500">
            {statusMessage || "⌘/Ctrl + Enter로 바로 추가"}
          </p>
        )}
      </div>
    </form>
  );
}
