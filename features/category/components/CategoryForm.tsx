"use client";
import { createCategoryAction } from "@/features/category/category.actions";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

export default function CategoryForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createCategoryAction, {
    ok: false,
    error: "",
  });

  useEffect(() => {
    if (state.ok) {
      onClose();
      router.refresh();
    }
  }, [state.ok, onClose, router]);

  return (
    <form action={formAction} className="flex w-xs flex-col gap-4">
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
        className={clsx("btn btn-primary", pending && "opacity-90")}
      >
        {pending ? "추가 중..." : "카테고리 추가"}
      </button>
    </form>
  );
}
