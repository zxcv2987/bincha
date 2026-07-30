"use client";

import { useEffect, useId, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

export default function BottomSheet({
  id,
  open,
  onClose,
  title,
  children,
}: {
  id?: string;
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    dialog.showModal();
    contentRef.current
      ?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      ?.focus();

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
      returnFocusRef.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      id={id}
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current.close();
      }}
      className="fixed inset-x-0 bottom-0 m-0 mt-auto max-h-[min(80dvh,42rem)] w-full max-w-none overflow-hidden rounded-t-xl bg-white p-0 shadow-xl backdrop:bg-zinc-700/20"
    >
      <div className="flex max-h-[min(80dvh,42rem)] flex-col">
        <div className="flex shrink-0 flex-col items-center border-b border-zinc-100 px-5 pt-2 pb-3">
          <span aria-hidden="true" className="mb-2 h-1 w-10 rounded-full bg-zinc-300" />
          <div className="flex w-full items-center justify-between gap-4">
            <h2 id={titleId} className="text-lg font-bold text-zinc-800">
              {title}
            </h2>
            <button
              type="button"
              aria-label={`${title} 닫기`}
              onClick={() => dialogRef.current?.close()}
              className="flex size-11 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        </div>
        <div ref={contentRef} className="min-h-0 overflow-y-auto">
          {children}
        </div>
      </div>
    </dialog>
  );
}
