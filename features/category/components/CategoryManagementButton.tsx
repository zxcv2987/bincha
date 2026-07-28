"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import { CategoryType } from "@/features/category/category.types";
import CategoryManagementDialog from "@/features/category/components/CategoryManagementDialog";

export default function CategoryManagementButton({
  categories,
}: {
  categories: CategoryType[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="rounded-md px-1.5 py-1 text-xs font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
        onClick={() => setOpen(true)}
      >
        관리
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="카테고리 관리"
        disableBackdropClose
      >
        <CategoryManagementDialog
          categories={categories}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
