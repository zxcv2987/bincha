"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import CategoryForm from "@/features/category/components/CategoryForm";

export default function CreateCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="w-full rounded-lg px-3 py-1.5 text-left text-sm font-semibold text-brand-600 hover:bg-brand-50 focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none"
        onClick={() => setOpen(true)}
      >
        + 카테고리 추가
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="카테고리 추가하기">
        <CategoryForm onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
