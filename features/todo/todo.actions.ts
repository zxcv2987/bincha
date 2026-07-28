"use server";

import { revalidatePath } from "next/cache";
import {
  createTodo,
  deleteTodo,
  toggleTodoCompleted,
  updateTodo,
} from "./todo.service";
import { requireCurrentUserId } from "@/lib/auth/session";

export type TodoInput = {
  title: string;
  text: string;
  categoryId: string | null;
};

export async function createTodoAction(input: TodoInput) {
  if (input.title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  if (input.categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

  try {
    const userId = await requireCurrentUserId();
    await createTodo(input.title, input.text, Number(input.categoryId), userId);
    revalidatePath("/");
  } catch (error) {
    console.error("할 일 추가 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function updateTodoAction(id: number, input: TodoInput) {
  if (input.title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  if (input.categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

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
  } catch (error) {
    console.error("할 일 수정 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function deleteTodoAction(todoId: number) {
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

export async function toggleTodoCompletedAction(todoId: number) {
  try {
    const userId = await requireCurrentUserId();
    const todo = await toggleTodoCompleted({ todoId, userId });
    revalidatePath("/");
    return { ok: true, todo };
  } catch (error) {
    console.error("할 일 완료 상태 변경 중 오류 발생:", error);
    return { ok: false, error: "완료 상태를 변경하지 못했습니다." };
  }
}
