"use server";

import { createCategory, deleteCategory } from "@/apis/category";
import { redirect } from "next/navigation";

export async function categoryFormAction(state: any, formData: FormData) {
  const category = formData.get("category");
  if (category === null || category === "")
    return { ok: false, error: "카테고리를 입력해 주세요." };

  try {
    await createCategory(category as string);
    return { ok: true };
  } catch (error) {
    console.error("카테고리 추가 중 오류 발생:", error);
    return { ok: false, error: "카테고리 추가 실패" };
  }
}

export async function deleteCategoryAction(state: any, categoryId: number) {
  try {
    await deleteCategory(categoryId);
    return { ok: true };
  } catch (error) {
    console.error("카테고리 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}
