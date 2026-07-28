"use client";

import { useState } from "react";
import { createCategoryByName } from "@/features/category/category.actions";
import { CategoryType } from "@/features/category/types";

export default function useCreateCategory(
  onSuccess: (category: CategoryType) => void,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (name: string) => {
    setPending(true);
    const result = await createCategoryByName(name);
    setPending(false);

    if (result.ok) {
      onSuccess(result.category);
    } else {
      setError(result.error);
    }
  };

  return { submit, pending, error };
}
