"use client";

import { useActionState, useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import { createTodoAction } from "@/actions/todo";
import { CategoryType } from "@/types/category";
import { redirect } from "next/navigation";
import TodoForm from "./TodoForm";

export default function CreateTodoList({
  categories,
}: {
  categories: CategoryType[];
}) {
  const [state, formAction, pending] = useActionState(createTodoAction, {
    ok: false,
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state.ok) {
      redirect("/");
    }
  });
  return (
    <div className="w-full py-2">
      <button className="btn" onClick={() => setIsOpen(true)}>
        할 일 추가 +
      </button>
      {isOpen && (
        <Modal closeFn={() => setIsOpen(false)}>
          <form
            action={formAction}
            className="flex w-xs flex-col gap-4 py-4 md:w-md"
          >
            <TodoForm state={state} categories={categories} />
            <button className="btn" disabled={pending}>
              {pending ? "로딩 중" : "할 일 추가"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
