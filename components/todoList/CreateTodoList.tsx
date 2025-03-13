"use client";

import { useActionState, useEffect, useState } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { todoFormAction } from "@/actions/todo";
import { CategoryType } from "@/types/category";
import TextArea from "@/components/common/TextArea";
import { redirect } from "next/navigation";
import Input from "@/components/common/Input";

export default function CreateTodoList({
  categories,
}: {
  categories: CategoryType[];
}) {
  const [state, formAction, pending] = useActionState(todoFormAction, {
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
      <Button onClick={() => setIsOpen(true)}>할 일 추가 +</Button>
      {isOpen && (
        <Modal closeFn={() => setIsOpen(false)}>
          <form
            action={formAction}
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
            <Button disabled={pending}>
              {pending ? "로딩 중" : "할 일 추가"}
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
