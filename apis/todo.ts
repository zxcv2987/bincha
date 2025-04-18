"use server";

import { TodoType } from "@/types/todos";
import FetchClient from "./fetchClient";
import { revalidateTag } from "next/cache";

export async function getTodos(): Promise<TodoType[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/todos`, {
      method: "GET",
      next: { tags: ["todos"] },
      cache: "force-cache",
    });
    return res.json();
  } catch (error) {
    console.error("할 일 목록 조회 중 오류 발생:", error);
    throw new Error(`할 일 목록 조회 실패: ${error}`);
  }
}

export async function createTodo(
  title: string,
  text: string,
  category_id: number,
) {
  try {
    const res = await FetchClient("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        title,
        text,
        category_id,
      }),
    });
    revalidateTag("todos");
    return res;
  } catch (error) {
    console.error("할 일 생성 중 오류 발생:", error);
    throw new Error(`할 일 생성 실패: ${error}`);
  }
}

export async function updateTodo({
  id,
  title,
  text,
  category_id,
}: {
  id: number;
  title: string;
  text: string;
  category_id: number;
}) {
  try {
    const res = await FetchClient(`/api/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        title,
        text,
        category_id,
      }),
    });
    revalidateTag("todos");
    return res;
  } catch (error) {
    console.error(`할 일(ID: ${id}) 수정 중 오류 발생:`, error);
    throw new Error(`할 일 수정 실패: ${error}`);
  }
}

export async function deleteTodo(id: number) {
  try {
    const res = await FetchClient(`/api/todos/${id}`, {
      method: "DELETE",
    });
    revalidateTag("todos");
    return res;
  } catch (error) {
    console.error(`할 일(ID: ${id}) 삭제 중 오류 발생:`, error);
    throw new Error(`할 일 삭제 실패: ${error}`);
  }
}
