"use client";
import { categoryFormAction } from "@/actions/category";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

export default function CategoryForm({
  setIsOpen,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [, startTransition] = useTransition();
  const router = useRouter();
  const [state, setState] = useState({ error: "" });
  const [pending, setPending] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setPending(true);
        startTransition(async () => {
          const formData = new FormData(e.currentTarget);
          const res = await categoryFormAction({ error: "" }, formData);
          if (res.ok) {
            setIsOpen(false);
            router.refresh();
          } else setState({ error: res.error || "" });
          setPending(false);
        });
      }}
      className="flex w-xs flex-col gap-4 pt-2"
    >
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
        {pending ? "추가 중..." : "카테고리 추가"}
      </Button>
    </form>
  );
}
