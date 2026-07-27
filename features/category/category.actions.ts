"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory } from "./category.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { CategoryAlreadyExistsError } from "./category.errors";

export async function createCategoryAction(
  _state: unknown,
  formData: FormData,
) {
  const category = formData.get("category");
  if (category === null || category === "")
    return { ok: false, error: "카테고리를 입력해 주세요." };

  try {
    const userId = await requireCurrentUserId();
    await createCategory(category as string, userId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    if (error instanceof CategoryAlreadyExistsError) {
      return { ok: false, error: "이미 사용 중인 카테고리 이름입니다." };
    }
    console.error("카테고리 추가 중 오류 발생:", error);
    return { ok: false, error: "카테고리 추가 실패" };
  }
}

export async function deleteCategoryAction(
  _state: unknown,
  categoryId: number,
) {
  try {
    const userId = await requireCurrentUserId();
    await deleteCategory(categoryId, userId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("카테고리 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}
