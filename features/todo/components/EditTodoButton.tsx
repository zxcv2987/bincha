"use client";

import { TodoType } from "@/features/todo/types";
import { useModalStore } from "@/features/modal/provider";

export default function EditTodoButton({ todo }: { todo: TodoType }) {
  const open = useModalStore((s) => s.open);

  return (
    <button className="btn" onClick={() => open("updateTodo", { todo })}>
      할 일 수정
    </button>
  );
}
