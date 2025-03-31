"use server";

import { revalidateTag } from "next/cache";
import FetchClient from "./fetchClient";
import { CategoryType } from "@/types/category";

export async function getCategory(): Promise<CategoryType[]> {
  return await FetchClient("/api/category", {
    method: "GET",
    next: { tags: ["category"] },
    cache: "force-cache",
  });
}

export async function createCategory(
  category_name: string,
): Promise<CategoryType> {
  const res = await FetchClient("/api/category", {
    method: "POST",
    body: JSON.stringify({
      category_name,
    }),
  });
  revalidateTag("category");
  return res;
}

export async function deleteCategory(id: number) {
  const res = await FetchClient(`/api/category/${id}`, {
    method: "DELETE",
  });
  revalidateTag("category");
  return res;
}
