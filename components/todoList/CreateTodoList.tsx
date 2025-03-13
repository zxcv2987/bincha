"use client";

import { useActionState, useState, useTransition } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { todoFormAction } from "@/actions/todo";
import { CategoryType } from "@/types/category";
import TextArea from "@/components/common/TextArea";
import { useRouter } from "next/navigation";
import Input from "@/components/common/Input";
import { createTodo } from "@/apis/todo";

export default function CreateTodoList({
  categories,
}: {
  categories: CategoryType[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(todoFormAction, {
    ok: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full py-2">
      <Button onClick={() => setIsOpen(true)}>할 일 추가 +</Button>
      {isOpen && (
        <Modal closeFn={() => setIsOpen(false)}>
          <form
            action={formAction}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLoading(true);
              startTransition(async () => {
                const formData = new FormData(e.currentTarget);
                try {
                  await createTodo(
                    formData.get("title") as string,
                    formData.get("text") as string,
                    formData.get("category") as unknown as number,
                  );
                } catch (error) {
                  alert("할 일 추가 실패");
                  console.log(error);
                }
                setIsLoading(false);
                setIsOpen(false);
                router.refresh();
              });
            }}
            className="flex w-xs flex-col gap-4 py-4 md:w-md"
          >
            <h3 className="text-xl font-semibold text-zinc-600">할 일</h3>
            <Input name="title" placeholder="할 일" />
            {state.error?.title && (
              <span className="text-xs text-red-400">{state.error.title}</span>
            )}
            <h3 className="text-xl font-semibold text-zinc-600">내용</h3>
            <TextArea name="text" placeholder="내용" rows={4} />
            {state.error?.text && (
              <span className="text-xs text-red-400">{state.error.text}</span>
            )}
            <h3 className="text-xl font-semibold text-zinc-600">카테고리</h3>
            <ul className="flex flex-row flex-wrap gap-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-3"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    className="peer hidden"
                  />
                  <span className="text-zinc-400 peer-checked:font-semibold peer-checked:text-zinc-700">
                    {category.category_name}
                  </span>
                </label>
              ))}
            </ul>
            {state.error?.categoryId && (
              <span className="text-xs text-red-400">
                {state.error.categoryId}
              </span>
            )}
            <Button className={isLoading ? "cursor-not-allowed" : ""}>
              {isLoading ? "로딩 중" : "할 일 추가"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
