"use client";

import { useActionState, useEffect, useTransition } from "react";
import Modal from "@/components/common/modal/Modal";
import { redirect } from "next/navigation";
import { TodoType } from "@/types/todos";
import TodoForm from "./TodoForm";
import { editTodoAction } from "@/actions/todo";
import { useModalStore } from "@/utils/providers/ModalProvider";

export default function EditTodoList({ todo }: { todo: TodoType }) {
  const [state, formAction, isLoading] = useActionState(editTodoAction, {
    ok: false,
  });
  const open = useModalStore((set) => set.open);

  useEffect(() => {
    if (state.ok) {
      redirect("/");
    }
  });
  return (
    <>
      <button className="btn" onClick={() => open("updateTodo")}>
        할 일 수정
      </button>
      <Modal modalType="updateTodo" isLoading={isLoading}>
        <Modal.Title>할 일 수정하기</Modal.Title>
        <TodoForm
          state={state}
          todo={todo}
          isLoading={isLoading}
          formAction={formAction}
        />
      </Modal>
    </>
  );
}
