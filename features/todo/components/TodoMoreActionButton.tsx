"use client";

import { useState } from "react";
import useModal from "@/features/shared/hooks/useModal";
import Dialog from "@/features/shared/components/Dialog";
import DeleteTodoButton from "@/features/todo/components/DeleteTodoButton";
import TodoForm from "@/features/todo/components/TodoForm";
import useUpdateTodo from "@/features/todo/hooks/useUpdateTodo";
import { TodoType } from "@/features/todo/types";

export default function TodoMoreActionButton({ todo }: { todo: TodoType }) {
  const { isOpen, setIsOpen, modalRef, setIsLoading } = useModal();
  const [editOpen, setEditOpen] = useState(false);
  const { submit, pending, error } = useUpdateTodo(todo.id, () =>
    setEditOpen(false),
  );

  return (
    <>
      <div className="relative flex items-center justify-end">
        <button
          onClick={() => setIsOpen(true)}
          aria-label="할 일 더보기"
          aria-haspopup="true"
          aria-expanded={isOpen}
          className="rounded-lg px-3 py-1 text-lg hover:bg-zinc-200"
        >
          ⋮
        </button>
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute right-1 -bottom-30 z-10 flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
          >
            <DeleteTodoButton
              todoId={todo.id}
              hasResult={Boolean(todo.result)}
              setIsLoading={setIsLoading}
            />
            <button
              className="btn"
              onClick={() => {
                // Why: Dialog portals outside modalRef's DOM subtree, so the
                // dropdown's outside-click handler would treat clicks inside
                // the edit form as "outside" and close this block mid-edit
                // unless the dropdown is closed first.
                setIsOpen(false);
                setEditOpen(true);
              }}
            >
              할 일 수정
            </button>
          </div>
        )}
      </div>
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="할 일 수정하기"
        disableBackdropClose={pending}
      >
        <TodoForm onSubmit={submit} pending={pending} error={error} todo={todo} />
      </Dialog>
    </>
  );
}
