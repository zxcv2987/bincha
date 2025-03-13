"use server";

import { TodoType } from "@/types/todos";
import FetchClient from "./fetchClient";
import { revalidateTag } from "next/cache";

export async function getTodos(): Promise<TodoType[]> {
  return await FetchClient("/api/todos", {
    method: "GET",
    next: { tags: ["todos"] },
  });
}

export async function createTodo(
  title: string,
  text: string,
  category_id: number,
) {
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
}
export async function updateTodo({
  id,
  title,
  text,
  category_id,
  completed,
}: TodoType) {
  const res = await FetchClient(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      text,
      category_id,
      completed,
    }),
  });
  revalidateTag("todos");
  return res;
}

export async function deleteTodo(id: number) {
  const res = await FetchClient(`/api/todos/${id}`, {
    method: "DELETE",
  });
  revalidateTag("todos");
  return res;
}
