"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  renameCategory,
  reorderCategories,
} from "./category.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import {
  CategoryAlreadyExistsError,
  CategoryHasTodosError,
  CategoryNotFoundError,
  CategoryOrderConflictError,
} from "./category.errors";
import { ActionResult } from "@/features/shared/hooks/useAsyncAction";
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
    if (error instanceof CategoryAlreadyExistsError) {
      return { ok: false, error: "이미 사용 중인 카테고리 이름입니다." };
    }
    console.error("카테고리 추가 중 오류 발생:", error);
    return { ok: false, error: "카테고리 추가 실패" };
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
    if (error instanceof CategoryHasTodosError) {
      return {
        ok: false,
        error: `이 카테고리에 할 일이 ${error.todoCount}개 있어 삭제할 수 없어요. 먼저 할 일을 다른 카테고리로 옮기거나 삭제해 주세요.`,
      };
    }
    console.error("카테고리 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
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
    if (error instanceof CategoryAlreadyExistsError) {
      return { ok: false, error: "이미 사용 중인 카테고리 이름입니다." };
    }
    if (error instanceof CategoryNotFoundError) {
      return { ok: false, error: "카테고리를 찾을 수 없습니다." };
    }
    console.error("카테고리 수정 중 오류 발생:", error);
    return { ok: false, error: "카테고리 수정 실패" };
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
    if (error instanceof CategoryOrderConflictError) {
      return {
        ok: false,
        error: "카테고리 목록이 변경됐어요. 새로고침 후 다시 시도해 주세요.",
      };
    }
    console.error("카테고리 순서 변경 중 오류 발생:", error);
    return { ok: false, error: "카테고리 순서 변경 실패" };
  }
}
