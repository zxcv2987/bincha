"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import CategoryForm from "@/features/category/components/CategoryForm";

export default function CreateCategoryButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="btn btn-primary w-full px-3"
        onClick={() => setOpen(true)}
      >
        카테고리 추가 +
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="카테고리">
        <CategoryForm onClose={() => setOpen(false)} />
      </Dialog>
    </>
  );
}
