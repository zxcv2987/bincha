"use server";

import {
  createTodo,
  deleteTodo,
  toggleTodoCompleted,
  updateTodo,
} from "./todo.service";
import { requireCurrentUserId } from "@/lib/auth/session";

export async function createTodoAction(_state: unknown, formData: FormData) {
  const title = formData.get("title");
  if (title === null || title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  const text = formData.get("text");
  const categoryId = formData.get("category");
  if (categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

  try {
    const userId = await requireCurrentUserId();
    await createTodo(
      title as string,
      (text as string | null) ?? "",
      Number(categoryId),
      userId,
    );
  } catch (error) {
    console.error("할 일 추가 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function updateTodoAction(_state: unknown, formData: FormData) {
  const id = formData.get("id");
  if (id === null || id === "")
    return { ok: false, error: { id: "id가 잘못되었습니다." } };
  const title = formData.get("title");
  if (title === null || title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  const text = formData.get("text");
  const categoryId = formData.get("category");
  if (categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

  try {
    const userId = await requireCurrentUserId();
    await updateTodo({
      id: Number(id),
      title: title as string,
      text: (text as string | null) ?? "",
      category_id: Number(categoryId),
      userId,
    });
  } catch (error) {
    console.error("할 일 수정 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function deleteTodoAction(_state: unknown, categoryId: number) {
  try {
    const userId = await requireCurrentUserId();
    await deleteTodo(categoryId, userId);
    return { ok: true };
  } catch (error) {
    console.error("할 일 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}

export async function toggleTodoCompletedAction(todoId: number) {
  try {
    const userId = await requireCurrentUserId();
    const todo = await toggleTodoCompleted({ todoId, userId });
    return { ok: true, todo };
  } catch (error) {
    console.error("할 일 완료 상태 변경 중 오류 발생:", error);
    return { ok: false, error: "완료 상태를 변경하지 못했습니다." };
  }
}
