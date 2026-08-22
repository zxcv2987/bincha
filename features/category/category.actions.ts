"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  renameCategory,
  reorderCategories,
} from "./category.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { ActionResult } from "@/features/shared/hooks/useAsyncAction";
import { toActionResult } from "@/features/shared/errors/toActionResult";
import { CategoryType } from "./category.types";

export async function createCategoryByName(
  name: string,
): Promise<ActionResult<CategoryType>> {
  if (name === "") return { ok: false, error: "카테고리를 입력해 주세요." };

  try {
    const userId = await requireCurrentUserId();
    const created = await createCategory(name, userId);
    revalidatePath("/");
    return { ok: true, data: created };
  } catch (error) {
    return toActionResult(error, "카테고리 추가 실패", "카테고리 추가 중 오류 발생:");
  }
}

export async function deleteCategoryAction(
  categoryId: number,
): Promise<ActionResult> {
  try {
    const userId = await requireCurrentUserId();
    await deleteCategory(categoryId, userId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return toActionResult(error, "삭제 실패", "카테고리 삭제 중 오류 발생:");
  }
}

export async function renameCategoryAction(
  categoryId: number,
  name: string,
): Promise<ActionResult<CategoryType>> {
  const trimmedName = name.trim();
  if (trimmedName === "") {
    return { ok: false, error: "카테고리 이름을 입력해 주세요." };
  }

  try {
    const userId = await requireCurrentUserId();
    const renamed = await renameCategory({
      categoryId,
      name: trimmedName,
      userId,
    });
    revalidatePath("/");
    return { ok: true, data: renamed };
  } catch (error) {
    return toActionResult(error, "카테고리 수정 실패", "카테고리 수정 중 오류 발생:");
  }
}

export async function reorderCategoriesAction(
  categoryIds: number[],
): Promise<ActionResult> {
  if (categoryIds.some((id) => !Number.isInteger(id) || id <= 0)) {
    return { ok: false, error: "잘못된 카테고리 순서입니다." };
  }

  try {
    const userId = await requireCurrentUserId();
    await reorderCategories({ categoryIds, userId });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return toActionResult(
      error,
      "카테고리 순서 변경 실패",
      "카테고리 순서 변경 중 오류 발생:",
    );
  }
}
