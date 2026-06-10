"use client";
import { categoryFormAction } from "@/features/category/actions";
import { useModalStore } from "@/features/modal/provider";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function CategoryForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(categoryFormAction, {
    ok: false,
    error: "",
  });
  const close = useModalStore((set) => set.close);

  useEffect(() => {
    if (state.ok) {
      close();
      router.refresh();
    }
  }, [state.ok, close, router]);

  return (
    <form action={formAction} className="flex w-xs flex-col gap-4 pt-2">
      <input
        className="input"
        placeholder="ex) 커리어, 연애, 기타 등"
        name="category"
      />
      {state?.error && (
        <span className="text-xs text-red-400">{state.error}</span>
      )}
      <button
        type="submit"
        disabled={pending}
        className={clsx(
          "btn",
          "w-full rounded-lg p-4 text-sm text-zinc-600 hover:bg-zinc-100",
          pending && "bg-zinc-100",
        )}
      >
        {pending ? "추가 중..." : "카테고리 추가"}
      </button>
    </form>
  );
}
