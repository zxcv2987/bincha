"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/features/category/category.actions";

export default function useDeleteCategory() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (categoryId: number) => {
    setPending(true);
    setError(undefined);
    const result = await deleteCategoryAction(categoryId);
    setPending(false);

    if (result.ok) {
      router.refresh();
    } else {
      setError(result.error ?? "삭제에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  return { submit, pending, error };
}
