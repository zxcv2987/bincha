import { TodoType } from "@/types/todos";
import FetchClient from "./fetchClient";

export async function getTodos() {
  return await FetchClient("/api/todos", {
    method: "GET",
  });
}

export async function createTodo(
  title: string,
  text: string,
  category_id: number,
) {
  return await FetchClient("/api/todos", {
    method: "POST",
    body: JSON.stringify({
      title,
      text,
      category_id,
    }),
  });
}
export async function updateTodo({
  id,
  title,
  text,
  category_id,
  completed,
}: TodoType) {
  return await FetchClient(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      title,
      text,
      category_id,
      completed,
    }),
  });
}

export async function deleteTodo(id: number) {
  return await FetchClient(`/api/todos/${id}`, {
    method: "DELETE",
  });
}
