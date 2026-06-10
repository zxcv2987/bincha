"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useModalStore } from "@/features/modal/provider";
import ModalTitle from "@/features/modal/components/ModalTitle";
import LoginFormContent from "@/features/modal/components/LoginFormContent";
import CategoryForm from "@/features/category/components/CategoryForm";
import TodoForm from "@/features/todo/components/TodoForm";
import { createTodoAction, editTodoAction } from "@/features/todo/actions";

const MODAL_TITLES: Record<string, string> = {
  login: "Login",
  category: "카테고리",
  todo: "할 일 추가하기",
  updateTodo: "할 일 수정하기",
};

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
  const [editState, editAction, editPending] = useActionState(editTodoAction, {
    ok: false,
  });

  const [loginLoading, setLoginLoading] = useState(false);

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
        className="absolute inset-0 bg-zinc-700 opacity-10"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-auto rounded-xl bg-white p-4"
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
      </div>
    </div>,
    portalRoot,
  );
}
