"use client";

import { useModalStore } from "@/features/modal/provider";

export default function CreateTodoButton() {
  const open = useModalStore((s) => s.open);

  return (
    <div className="w-full py-2">
      <button className="btn" onClick={() => open("todo")}>
        할 일 추가 +
      </button>
    </div>
  );
}
