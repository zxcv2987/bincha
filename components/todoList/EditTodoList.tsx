"use client";

import { useActionState, useEffect, useTransition } from "react";
import Modal from "@/components/common/modal/Modal";
import { redirect } from "next/navigation";
import { TodoType } from "@/types/todos";
import TodoForm from "./TodoForm";
import { editTodoAction } from "@/actions/todo";
import { useModalStore } from "@/utils/providers/ModalProvider";

export default function EditTodoList({ todo }: { todo: TodoType }) {
  const [state] = useActionState(editTodoAction, {
    ok: false,
  });
  const [pending, startTransition] = useTransition();
  const open = useModalStore((set) => set.open);
  const close = useModalStore((set) => set.close);

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
      <Modal modalType="updateTodo">
        <Modal.Title>할 일 수정하기</Modal.Title>
        <form
          onSubmit={(e) => {
            startTransition(async () => {
              e.preventDefault();
              e.stopPropagation();
              const formData = new FormData(e.currentTarget);
              formData.append("id", todo.id.toString());
              await editTodoAction({}, formData);
              close();
            });
          }}
          className="flex w-xs flex-col gap-4 py-4 md:w-md"
        >
          <TodoForm state={state} todo={todo} />
          <button className="btn" disabled={pending}>
            {pending ? "로딩 중" : "할 일 수정"}
          </button>
        </form>
      </Modal>
    </>
  );
}
