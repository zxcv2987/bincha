"use client";

import clsx from "clsx";
import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createCategoryByName } from "@/features/category/category.actions";

export default function CategoryForm({ onClose }: { onClose: () => void }) {
  const { submit, pending, error } = useAsyncAction(createCategoryByName, {
    onSuccess: onClose,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        submit(String(formData.get("category") ?? ""));
      }}
      className="flex w-xs flex-col gap-4"
    >
      <input
        className="input"
        placeholder="ex) 커리어, 연애, 기타 등"
        name="category"
        spellCheck={false}
        autoFocus
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
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
