"use client";

import { useCategoryStore } from "@/features/category/provider";
import { createCategoryAction } from "@/features/category/category.actions";
import { CategoryType } from "@/features/category/types";
import { useActionState, useEffect, useId, useRef, useState } from "react";

export default function CategoryPicker({
  defaultCategoryId,
  error,
}: {
  defaultCategoryId?: number;
  error?: string;
}) {
  const categories = useCategoryStore((s) => s.categories);
  const setCategories = useCategoryStore((s) => s.setCategories);
  const legendId = useId();
  const [selectedId, setSelectedId] = useState(
    defaultCategoryId ? String(defaultCategoryId) : "",
  );
  const [creating, setCreating] = useState(false);

  return (
    <fieldset
      className="m-0 flex flex-col gap-1.5 border-0 p-0"
      aria-labelledby={legendId}
    >
      <legend id={legendId} className="p-0 text-sm font-semibold text-zinc-600">
        카테고리 <span className="font-normal text-red-400">필수</span>
      </legend>

      {categories.length > 0 && (
        <ul className="flex flex-row flex-wrap gap-2 pt-1">
          {categories.map((category) => (
            <li key={category.id}>
              <label className="flex max-w-40 cursor-pointer items-center rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800 peer-checked:bg-brand-50 peer-checked:font-semibold peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-1">
                <input
                  type="radio"
                  name="category"
                  className="peer sr-only"
                  value={category.id}
                  checked={selectedId === String(category.id)}
                  onChange={() => setSelectedId(String(category.id))}
                />
                <span className="truncate">
                  {category.category_name.trim() || "이름 없음"}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {creating ? (
        <InlineCategoryCreate
          onCreated={(created) => {
            setCategories([...categories, created]);
            setSelectedId(String(created.id));
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      ) : categories.length === 0 ? (
        <p className="pt-1 text-sm text-zinc-400">
          카테고리가 아직 없어요.{" "}
          <button
            type="button"
            className="font-semibold text-brand-600 underline underline-offset-2"
            onClick={() => setCreating(true)}
          >
            지금 만들기
          </button>
        </p>
      ) : (
        <button
          type="button"
          className="w-fit rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-brand-600 hover:bg-brand-50"
          onClick={() => setCreating(true)}
        >
          + 새 카테고리
        </button>
      )}

      {error && <span className="text-xs text-red-400">{error}</span>}
    </fieldset>
  );
}

function InlineCategoryCreate({
  onCreated,
  onCancel,
}: {
  onCreated: (category: CategoryType) => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(createCategoryAction, {
    ok: false,
    error: "",
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state.ok && state.category) onCreated(state.category);
  }, [state, onCreated]);

  const submit = () => {
    if (!inputRef.current) return;
    const formData = new FormData();
    formData.set("category", inputRef.current.value);
    formAction(formData);
  };

  return (
    <div className="flex flex-col gap-1 pt-1">
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          placeholder="ex) 커리어, 연애, 기타 등"
          className="input py-1.5 text-sm"
          spellCheck={false}
          onKeyDown={(e) => {
            if (e.key === "Escape") onCancel();
            if (e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={submit}
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50"
        >
          {pending ? "추가 중..." : "추가"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-zinc-400 hover:bg-zinc-50"
        >
          취소
        </button>
      </div>
      {state?.error && <span className="text-xs text-red-400">{state.error}</span>}
    </div>
  );
}
