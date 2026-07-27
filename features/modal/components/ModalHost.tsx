"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useModalStore } from "@/features/modal/provider";
import ModalTitle from "@/features/modal/components/ModalTitle";
import LoginFormContent from "@/features/modal/components/LoginFormContent";
import CategoryForm from "@/features/category/components/CategoryForm";
import TodoForm from "@/features/todo/components/TodoForm";
import {
  createTodoAction,
  updateTodoAction,
} from "@/features/todo/todo.actions";
import ResultForm from "@/features/result/components/ResultForm";
import {
  createTaskResultAction,
  updateTaskResultAction,
} from "@/features/result/result.actions";
import { TodoType } from "@/features/todo/types";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const MODAL_TITLES: Record<string, string> = {
  login: "로그인",
  category: "카테고리",
  todo: "할 일 추가하기",
  updateTodo: "할 일 수정하기",
  result: "실행 결과 기록",
  updateResult: "실행 결과 보기",
};

function ResultModalContent({
  todo,
  mode,
}: {
  todo: TodoType;
  mode: "create" | "update";
}) {
  const router = useRouter();
  const close = useModalStore((state) => state.close);
  const action =
    mode === "create" ? createTaskResultAction : updateTaskResultAction;
  const [state, formAction, pending] = useActionState(action, { ok: false });

  useEffect(() => {
    if (state.ok) {
      close();
      router.refresh();
    }
  }, [state.ok, close, router]);

  return (
    <ResultForm
      todo={todo}
      state={state}
      formAction={formAction}
      pending={pending}
    />
  );
}

export default function ModalHost() {
  const router = useRouter();
  const isOpen = useModalStore((s) => s.isOpen);
  const openModal = useModalStore((s) => s.openModal);
  const close = useModalStore((s) => s.close);
  const editingTodo = useModalStore((s) => s.editingTodo);

  const [createState, createAction, createPending] = useActionState(
    createTodoAction,
    { ok: false },
  );
  const [editState, editAction, editPending] = useActionState(
    updateTodoAction,
    {
      ok: false,
    },
  );
  const [loginLoading, setLoginLoading] = useState(false);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (createState.ok) {
      close();
      router.refresh();
    }
  }, [createState.ok, close, router]);

  useEffect(() => {
    if (editState.ok) {
      close();
      router.refresh();
    }
  }, [editState.ok, close, router]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen, openModal]);

  if (!isOpen || !openModal) return null;

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  const isLoading =
    openModal === "login"
      ? loginLoading
      : openModal === "todo"
        ? createPending
        : openModal === "updateTodo"
          ? editPending
          : false;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={isLoading ? undefined : close}
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
        <ModalTitle>{MODAL_TITLES[openModal]}</ModalTitle>
        {openModal === "login" && (
          <LoginFormContent onLoadingChange={setLoginLoading} />
        )}
        {openModal === "category" && <CategoryForm />}
        {openModal === "todo" && (
          <TodoForm formAction={createAction} state={createState} />
        )}
        {openModal === "updateTodo" && editingTodo && (
          <TodoForm
            formAction={editAction}
            state={editState}
            todo={editingTodo}
          />
        )}
        {openModal === "result" && editingTodo && (
          <ResultModalContent
            key={`create-${editingTodo.id}`}
            todo={editingTodo}
            mode="create"
          />
        )}
        {openModal === "updateResult" && editingTodo?.result && (
          <ResultModalContent
            key={`update-${editingTodo.id}-${editingTodo.result.id}`}
            todo={editingTodo}
            mode="update"
          />
        )}
      </div>
    </div>,
    portalRoot,
  );
}
