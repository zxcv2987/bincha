"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import Modal from "@/components/common/Modal";
import { CategoryType } from "@/types/category";
import { redirect } from "next/navigation";
import { TodoType } from "@/types/todos";
import TodoForm from "./TodoForm";
import { editTodoAction } from "@/actions/todo";

export default function EditTodoList({
  todo,
  categories,
}: {
  todo: TodoType;
  categories: CategoryType[];
}) {
  const [state] = useActionState(editTodoAction, {
    ok: false,
  });
  const [pending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      redirect("/");
    }
  });
  return (
    <div className="w-full py-2">
      <button className="btn" onClick={() => setIsOpen(true)}>
        할 일 수정
      </button>
      {isOpen && (
        <Modal closeFn={() => setIsOpen(false)}>
          <form
            onSubmit={(e) => {
              startTransition(async () => {
                e.preventDefault();
                e.stopPropagation();
                const formData = new FormData(e.currentTarget);
                formData.append("id", todo.id.toString());
                await editTodoAction({}, formData);
                setIsOpen(false);
              });
            }}
            className="flex w-xs flex-col gap-4 py-4 md:w-md"
          >
            <TodoForm state={state} categories={categories} todo={todo} />
            <button className="btn" disabled={pending}>
              {pending ? "로딩 중" : "할 일 수정"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
