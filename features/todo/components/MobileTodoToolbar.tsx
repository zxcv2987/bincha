"use client";

import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { CategoryType } from "@/features/category/category.types";
import CategoryForm from "@/features/category/components/CategoryForm";
import CategoryManagementDialog from "@/features/category/components/CategoryManagementDialog";
import BottomSheet from "@/features/shared/components/BottomSheet";
import Dialog from "@/features/shared/components/Dialog";
import {
  COMPLETION_FILTERS,
  CompletionFilter,
  getTodoFilterSummary,
} from "@/features/todo/todoFilters";

export default function MobileTodoToolbar({
  categories,
  selectedCategoryId,
  completionFilter,
  onApplyFilters,
}: {
  categories: CategoryType[];
  selectedCategoryId: number | null;
  completionFilter: CompletionFilter;
  onApplyFilters: (
    categoryId: number | null,
    completion: CompletionFilter,
  ) => void;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const filterSheetId = useId();
  const moreSheetId = useId();
  const [draftCategoryId, setDraftCategoryId] = useState<number | null>(
    selectedCategoryId,
  );
  const [draftCompletion, setDraftCompletion] =
    useState<CompletionFilter>(completionFilter);

  const openFilters = () => {
    setDraftCategoryId(selectedCategoryId);
    setDraftCompletion(completionFilter);
    setFilterOpen(true);
  };

  const openMoreDialog = (dialog: "create" | "manage") => {
    setMoreOpen(false);
    window.requestAnimationFrame(() => {
      if (dialog === "create") setCreateOpen(true);
      else setManageOpen(true);
    });
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeMobileSheets = (event: MediaQueryListEvent | MediaQueryList) => {
      if (!event.matches) return;
      setFilterOpen(false);
      setMoreOpen(false);
    };

    closeMobileSheets(desktop);
    desktop.addEventListener("change", closeMobileSheets);
    return () => desktop.removeEventListener("change", closeMobileSheets);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3 md:hidden">
      <p className="min-w-0 truncate text-sm font-semibold text-zinc-700">
        {getTodoFilterSummary(
          completionFilter,
          selectedCategoryId,
          categories,
        )}
      </p>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={openFilters}
          aria-expanded={filterOpen}
          aria-controls={filterSheetId}
          className="flex min-h-11 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4">
            <path d="M3 5h14M5.5 10h9M8 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          필터
        </button>
        <button
          type="button"
          aria-label="할 일 메뉴 더보기"
          onClick={() => setMoreOpen(true)}
          aria-expanded={moreOpen}
          aria-controls={moreSheetId}
          className="flex size-11 items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        >
          <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
      </div>

      <BottomSheet id={filterSheetId} open={filterOpen} onClose={() => setFilterOpen(false)} title="할 일 필터">
        <div className="flex flex-col gap-6 px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold text-zinc-700">카테고리</legend>
            {[
              { id: null, label: "전체" },
              ...categories.map((category) => ({
                id: category.id,
                label: category.category_name,
              })),
            ].map(({ id, label }) => {
              const selected = draftCategoryId === id;

              return (
                <label
                  key={id ?? "all"}
                  className={clsx(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40 has-focus-visible:ring-offset-1",
                    selected
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                  )}
                >
                  <input
                    type="radio"
                    name="mobile-category-filter"
                    checked={selected}
                    onChange={() => setDraftCategoryId(id)}
                    className="sr-only"
                  />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {selected && (
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
                      <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </label>
              );
            })}
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-sm font-semibold text-zinc-700">완료 상태</legend>
            {COMPLETION_FILTERS.map(([value, label]) => {
              const selected = draftCompletion === value;

              return (
                <label
                  key={value}
                  className={clsx(
                    "flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-3 text-sm has-focus-visible:ring-2 has-focus-visible:ring-brand-500/40 has-focus-visible:ring-offset-1",
                    selected
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                  )}
                >
                  <input
                    type="radio"
                    name="mobile-completion-filter"
                    checked={selected}
                    onChange={() => setDraftCompletion(value)}
                    className="sr-only"
                  />
                  <span className="min-w-0 flex-1 truncate">{label}</span>
                  {selected && (
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="size-4 shrink-0">
                      <path d="m4 10 4 4 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </label>
              );
            })}
          </fieldset>

          <div className="sticky bottom-0 flex gap-2 border-t border-zinc-100 bg-white pt-4">
            <button
              type="button"
              onClick={() => {
                setDraftCategoryId(null);
                setDraftCompletion("active");
              }}
              className="btn w-auto flex-1"
            >
              초기화
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyFilters(draftCategoryId, draftCompletion);
                setFilterOpen(false);
              }}
              className="btn btn-primary flex-1"
            >
              필터 적용
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet id={moreSheetId} open={moreOpen} onClose={() => setMoreOpen(false)} title="더보기">
        <div className="flex flex-col px-3 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
          {[
            ["create", "카테고리 추가"],
            ["manage", "카테고리 관리"],
          ].map(([action, label]) => (
            <button
              key={action}
              type="button"
              onClick={() => openMoreDialog(action as "create" | "manage")}
              className={clsx(
                "min-h-12 rounded-lg px-3 text-left text-sm font-semibold focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none",
                action === "create"
                  ? "text-brand-700 hover:bg-brand-50"
                  : "text-zinc-700 hover:bg-zinc-100",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </BottomSheet>

      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} title="카테고리 추가하기">
        <CategoryForm onClose={() => setCreateOpen(false)} />
      </Dialog>
      <Dialog open={manageOpen} onClose={() => setManageOpen(false)} title="카테고리 관리" disableBackdropClose>
        <CategoryManagementDialog categories={categories} onClose={() => setManageOpen(false)} />
      </Dialog>
    </div>
  );
}
