import FetchClient from "./fetchClient";
import { CategoryType } from "@/types/category";

export async function getCategory(): Promise<CategoryType[]> {
  return await FetchClient("/api/category", {
    method: "GET",
  });
}

export async function createCategory(
  category_name: string,
): Promise<CategoryType> {
  return await FetchClient("/api/category", {
    method: "POST",
    body: JSON.stringify({
      category_name,
    }),
  });
}

export async function deleteCategory(id: number) {
  return await FetchClient(`/api/category/${id}`, {
    method: "DELETE",
  });
}
