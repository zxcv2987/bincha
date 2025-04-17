"use server";

import { revalidateTag } from "next/cache";
import FetchClient from "./fetchClient";
import { CategoryType } from "@/types/category";

export async function getCategory(): Promise<CategoryType[]> {
  try {
    const data = await FetchClient("/api/category", {
      method: "GET",
      next: { tags: ["category"] },
      cache: "force-cache",
    });
    return data;
  } catch (error) {
    console.error("카테고리 조회 중 오류 발생:", error);
    throw new Error(`카테고리 조회 실패: ${error}`);
  }
}

export async function createCategory(
  category_name: string,
): Promise<CategoryType> {
  try {
    const res = await FetchClient("/api/category", {
      method: "POST",
      body: JSON.stringify({
        category_name,
      }),
    });
    revalidateTag("category");
    return res;
  } catch (error) {
    console.error("카테고리 생성 중 오류 발생:", error);
    throw new Error(`카테고리 생성 실패: ${error}`);
  }
}

export async function deleteCategory(id: number) {
  try {
    const res = await FetchClient(`/api/category/${id}`, {
      method: "DELETE",
    });
    revalidateTag("category");
    return res;
  } catch (error) {
    console.error(`카테고리(ID: ${id}) 삭제 중 오류 발생:`, error);
    throw new Error(`카테고리 삭제 실패: ${error}`);
  }
}
