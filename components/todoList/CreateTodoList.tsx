"use client";

import { useActionState, useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { createTodoAction } from "@/actions/todo";
import { CategoryType } from "@/types/category";
import { redirect } from "next/navigation";
import TodoForm from "./TodoForm";
import { useModalStore } from "@/utils/providers/ModalProvider";

export default function CreateTodoList() {
  const [state, formAction, pending] = useActionState(createTodoAction, {
    ok: false,
  });
  const { open, close } = useModalStore((set) => set);

  useEffect(() => {
    if (state.ok) {
      close();
      redirect("/");
    }
  });
  return (
    <div className="w-full py-2">
      <button className="btn" onClick={() => open("todo")}>
        할 일 추가 +
      </button>
      <Modal modalType="todo">
        <form
          action={formAction}
          className="flex w-xs flex-col gap-4 py-4 md:w-md"
        >
          <TodoForm state={state} />
          <button className="btn" disabled={pending}>
            {pending ? "로딩 중" : "할 일 추가"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
