"use server";

import { revalidatePath } from "next/cache";
import { createCategory, deleteCategory } from "./category.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import {
  CategoryAlreadyExistsError,
  CategoryHasTodosError,
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
