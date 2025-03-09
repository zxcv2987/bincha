import { TodoType } from "@/types/todos";
import FetchClient from "./fetchClient";
import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { NextResponse } from "next/server";

export async function getTodos() {
  try {
    const todos = await prisma.todos.findMany({
      include: {
        category: true,
      },
      orderBy: [{ completed: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(serializeBigInt(todos));
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
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
