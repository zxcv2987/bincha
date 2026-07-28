"use client";

import clsx from "clsx";
import { useId } from "react";
import useAsyncAction from "@/features/shared/hooks/useAsyncAction";
import { createCategoryByName } from "@/features/category/category.actions";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function CategoryForm({ onClose }: { onClose: () => void }) {
  const { submit, pending, error } = useAsyncAction(createCategoryByName, {
    onSuccess: onClose,
  });
  const nameId = useId();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        submit(String(formData.get("category") ?? ""));
      }}
      className="flex w-xs flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={nameId} className="text-sm font-semibold text-zinc-600">
          카테고리 이름
        </label>
        <input
          id={nameId}
          className="input"
          placeholder="ex) 커리어, 연애, 기타 등"
          name="category"
          spellCheck={false}
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
      <button
        type="submit"
        disabled={pending}
        className={clsx("btn btn-primary", pending && "opacity-90")}
      >
        <ButtonLabel pending={pending} pendingText="추가 중...">
          카테고리 추가
        </ButtonLabel>
      </button>
    </form>
  );
}
