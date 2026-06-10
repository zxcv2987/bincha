"use client";

import { TodoType } from "@/features/todo/types";
import Content from "@/features/shared/components/Content";
import TodoMoreActionButton from "@/features/todo/components/TodoMoreActionButton";

export default function Todo({
  todo,
  isReadOnly,
}: {
  todo: TodoType;
  isReadOnly?: boolean;
}) {
  return (
    <div
      key={todo.id}
      className="flex h-auto w-full items-start rounded-xl bg-zinc-50 p-4 text-xl font-medium text-zinc-700"
    >
      <div className="flex w-full flex-row items-center bg-zinc-50">
        <div className="flex w-full flex-col gap-2">
          <h3 className="w-full truncate text-lg font-bold break-words">
            {todo.title.trim() || "제목 없음"}
          </h3>
          {todo.text.trim() ? (
            <span className="w-full pl-1 text-base break-words">
              <Content content={todo.text} />
            </span>
          ) : (
            <span className="w-full pl-1 text-base text-zinc-400">내용 없음</span>
          )}
        </div>
      </div>
      {!isReadOnly && <TodoMoreActionButton todo={todo} />}
    </div>
  );
}
