"use client";
import useModal from "@/utils/hooks/useModal";
import DeleteTodoButton from "@/components/ui/todoList/DeleteTodoButton";
import EditTodoList from "@/components/ui/todoList/EditTodoList";
import { TodoType } from "@/types/todos";

export default function TodoMoreActionButton({ todo }: { todo: TodoType }) {
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
    <>
      <div className="relative flex items-center justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg px-3 py-1 text-lg hover:bg-zinc-200"
        >
          ⋮
        </button>
        {isOpen && (
          <div
            ref={modalRef}
            className="absolute right-1 -bottom-30 z-10 flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
          >
            <DeleteTodoButton todoId={todo.id} />
            <EditTodoList todo={todo} />
          </div>
        )}
      </div>
    </>
  );
}
