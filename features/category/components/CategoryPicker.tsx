"use client";

import { useCategoryStore } from "@/features/category/provider";
import useCreateCategory from "@/features/category/hooks/useCreateCategory";
import { CategoryType } from "@/features/category/category.types";
import { useEffect, useId, useRef, useState } from "react";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

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
  const listRef = useRef<HTMLUListElement>(null);
  const pendingFocusIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pendingFocusIdRef.current) return;
    listRef.current
      ?.querySelector<HTMLInputElement>(`input[value="${pendingFocusIdRef.current}"]`)
      ?.focus();
    pendingFocusIdRef.current = null;
  }, [categories]);

  return (
    <fieldset
      className="m-0 flex flex-col gap-1.5 border-0 p-0"
      aria-labelledby={legendId}
    >
      <legend id={legendId} className="p-0 text-sm font-semibold text-zinc-600">
        카테고리 <span className="text-red-400" aria-hidden="true">*</span>
        <span className="sr-only">필수</span>
      </legend>

      {categories.length > 0 && (
        <ul ref={listRef} className="flex flex-row flex-wrap gap-2 pt-1">
          {categories.map((category) => (
            <li key={category.id}>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  className="peer sr-only outline-none"
                  value={category.id}
                  checked={selectedId === String(category.id)}
                  onChange={() => setSelectedId(String(category.id))}
                />
                <span className="flex max-w-40 items-center truncate rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition-colors peer-checked:bg-brand-50 peer-checked:font-semibold peer-checked:text-brand-700 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/40 peer-focus-visible:ring-offset-1 peer-not-checked:hover:bg-zinc-50 peer-not-checked:hover:text-zinc-800">
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
            pendingFocusIdRef.current = String(created.id);
            setCategories([...categories, created]);
            setSelectedId(String(created.id));
            setCreating(false);
          }}
          onCancel={() => setCreating(false)}
        />
      ) : categories.length === 0 ? (
        <p className="pt-1 text-sm text-zinc-500">
          카테고리가 아직 없어요.{" "}
          <button
            type="button"
            className="rounded font-semibold text-brand-600 underline underline-offset-2 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
            onClick={() => setCreating(true)}
          >
            지금 만들기
          </button>
        </p>
      ) : (
        <button
          type="button"
          className="w-fit rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
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
  const { submit, pending, error } = useCreateCategory(onCreated);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!inputRef.current) return;
    submit(inputRef.current.value);
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
              handleSubmit();
            }
          }}
        />
        <button
          type="button"
          disabled={pending}
          onClick={handleSubmit}
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          <ButtonLabel pending={pending} pendingText="추가 중...">
            추가
          </ButtonLabel>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 rounded-lg px-2 py-1.5 text-sm text-zinc-500 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          취소
        </button>
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
