"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Dialog({
  open,
  onClose,
  title,
  disableBackdropClose = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  disableBackdropClose?: boolean;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    if (dialog && !dialog.contains(document.activeElement)) {
      dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus();
    }

    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapTab);
    return () => document.removeEventListener("keydown", trapTab);
  }, [open]);

  if (!open) return null;

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={disableBackdropClose ? undefined : onClose}
        className="absolute inset-0 bg-zinc-700 opacity-20"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl bg-white p-4 shadow-xl"
      >
        <div className="flex w-full flex-row items-center justify-between border-b border-zinc-100 pb-3">
          <h2 id="modal-title" className="text-2xl font-bold text-zinc-700">
            {title}
          </h2>
          <button
            type="button"
            aria-label="모달 닫기"
            onClick={onClose}
            className="cursor-pointer px-1 text-sm font-thin text-zinc-700"
          >
            ✖
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>,
    portalRoot,
  );
}
