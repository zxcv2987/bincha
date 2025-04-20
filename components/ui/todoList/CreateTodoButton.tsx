"use client";

import { useActionState, useEffect } from "react";
import Modal from "@/components/common/modal/Modal";
import { createTodoAction } from "@/actions/todo";
import { redirect } from "next/navigation";
import TodoForm from "@/components/ui/todoList/TodoForm";
import { useModalStore } from "@/utils/providers/ModalProvider";

export default function CreateTodoButton() {
  const [state, formAction, pending] = useActionState(createTodoAction, {
    ok: false,
  });
  const open = useModalStore((set) => set.open);
  const close = useModalStore((set) => set.close);

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
      <Modal modalType="todo" isLoading={pending}>
        <Modal.Title>할 일 추가하기</Modal.Title>
        <TodoForm formAction={formAction} state={state} isLoading={pending} />
      </Modal>
    </div>
  );
}
