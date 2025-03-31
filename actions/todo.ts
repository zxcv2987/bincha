"use server";

import { createTodo, deleteTodo, updateTodo } from "@/apis/todo";

export async function createTodoAction(state: any, formData: FormData) {
  const title = formData.get("title");
  if (title === null || title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  const text = formData.get("text");
  if (text === null || text === "")
    return { ok: false, error: { text: "내용을 입력해 주세요." } };
  const categoryId = formData.get("category");
  if (categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

  try {
    await createTodo(title as string, text as string, Number(categoryId));
  } catch (error) {
    console.error("할 일 추가 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function editTodoAction(state: any, formData: FormData) {
  const id = formData.get("id");
  if (id === null || id === "")
    return { ok: false, error: { id: "id가 잘못되었습니다." } };
  const title = formData.get("title");
  if (title === null || title === "")
    return { ok: false, error: { title: "할 일을 입력해 주세요." } };
  const text = formData.get("text");
  if (text === null || text === "")
    return { ok: false, error: { text: "내용을 입력해 주세요." } };
  const categoryId = formData.get("category");
  if (categoryId === null)
    return { ok: false, error: { categoryId: "카테고리를 선택해 주세요." } };

  try {
    await updateTodo({
      id: Number(id),
      title: title as string,
      text: text as string,
      category_id: Number(categoryId),
      completed: false,
    });
  } catch (error) {
    console.error("할 일 추가 중 오류 발생:", error);
    return { ok: false };
  }

  return { ok: true };
}

export async function deleteTodoAction(state: any, categoryId: number) {
  try {
    await deleteTodo(categoryId);
    return { ok: true };
  } catch (error) {
    console.error("할 일 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}
