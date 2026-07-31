"use server";

import { revalidatePath } from "next/cache";
import {
  createTodo,
  deleteTodo,
  reorderTodos,
  toggleTodoCompleted,
  updateTodo,
} from "./todo.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { ActionResult } from "@/features/shared/hooks/useAsyncAction";
import { CategoryNotFoundError } from "@/features/category/category.errors";
import { TodoOrderConflictError } from "./todo.errors";

export type TodoInput = {
  title: string;
  text: string;
  categoryId: string | null;
};

function validateTodoInput(input: TodoInput) {
  const fieldErrors: Record<string, string> = {};
  if (input.title === "") fieldErrors.title = "할 일을 입력해 주세요.";
  if (input.categoryId === null)
    fieldErrors.categoryId = "카테고리를 선택해 주세요.";
  return fieldErrors;
}

export async function createTodoAction(
  input: TodoInput,
): Promise<ActionResult> {
  const fieldErrors = validateTodoInput(input);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  try {
    const userId = await requireCurrentUserId();
    await createTodo(input.title, input.text, Number(input.categoryId), userId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("할 일 추가 중 오류 발생:", error);
    return { ok: false, error: "할 일을 추가하지 못했습니다." };
  }
}

export async function updateTodoAction(
  id: number,
  input: TodoInput,
): Promise<ActionResult> {
  const fieldErrors = validateTodoInput(input);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  try {
    const userId = await requireCurrentUserId();
    await updateTodo({
      id,
      title: input.title,
      text: input.text,
      category_id: Number(input.categoryId),
      userId,
    });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("할 일 수정 중 오류 발생:", error);
    return { ok: false, error: "할 일을 수정하지 못했습니다." };
  }
}

export async function deleteTodoAction(todoId: number): Promise<ActionResult> {
  try {
    const userId = await requireCurrentUserId();
    await deleteTodo(todoId, userId);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("할 일 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}

export async function reorderTodosAction(
  categoryId: number,
  todoIds: number[],
): Promise<ActionResult> {
  if (
    !Number.isInteger(categoryId) ||
    categoryId <= 0 ||
    todoIds.some((id) => !Number.isInteger(id) || id <= 0)
  ) {
    return { ok: false, error: "잘못된 할 일 순서입니다." };
  }

  try {
    const userId = await requireCurrentUserId();
    await reorderTodos({ categoryId, todoIds, userId });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      return { ok: false, error: "카테고리를 찾을 수 없습니다." };
    }
    if (error instanceof TodoOrderConflictError) {
      return {
        ok: false,
        error: "할 일 목록이 변경됐어요. 새로고침 후 다시 시도해 주세요.",
      };
    }
    console.error("할 일 순서 변경 중 오류 발생:", error);
    return { ok: false, error: "할 일 순서 변경 실패" };
  }
}

export async function toggleTodoCompletedAction(
  todoId: number,
): Promise<ActionResult> {
  try {
    const userId = await requireCurrentUserId();
    await toggleTodoCompleted({ todoId, userId });
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("할 일 완료 상태 변경 중 오류 발생:", error);
    return { ok: false, error: "완료 상태를 변경하지 못했습니다." };
  }
}
