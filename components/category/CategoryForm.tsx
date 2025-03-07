"use client";
import { categoryFormAction } from "@/actions/category";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { useActionState, useEffect } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function CategoryForm() {
  const [state, formAction, pending] = useActionState(categoryFormAction, {
    ok: false,
  });
  useEffect(() => {
    if (state.ok) redirect("/");
  }, [state]);
  return (
    <form action={formAction} className="flex w-xs flex-col gap-4 pt-2">
      <Input placeholder="ex) 커리어, 연애, 기타 등" name="category" />
      {state?.error && (
        <span className="text-xs text-red-400">{state.error}</span>
      )}
      <Button
        type="submit"
        className={clsx(
          "w-full rounded-lg p-4 text-sm text-zinc-600 hover:bg-zinc-100",
          pending && "bg-zinc-100",
        )}
      >
        {pending ? "로딩 중" : "카테고리 추가"}
      </Button>
    </form>
  );
}
