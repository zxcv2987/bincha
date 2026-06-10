import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { revalidateTag } from "next/cache";
import { TodoType } from "@/types/todos";

export async function getTodos(): Promise<TodoType[]> {
  const todos = await prisma.todos.findMany({
    include: { category: true },
    orderBy: [{ id: "asc" }, { category_id: "asc" }],
  });
  return serializeBigInt(todos);
}

export async function createTodo(
  title: string,
  text: string,
  category_id: number,
) {
  if (!title || !text || !category_id) {
    throw new Error("Missing required fields");
  }

  const todo = await prisma.todos.create({
    data: { title, text, category_id },
  });
  revalidateTag("todos", "max");
  return serializeBigInt(todo);
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
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (text !== undefined) updateData.text = text;
  if (category_id !== undefined) updateData.category_id = category_id;

  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field must be provided to update.");
  }

  const todo = await prisma.todos.update({
    where: { id },
    data: updateData,
  });
  revalidateTag("todos", "max");
  return serializeBigInt(todo);
}

export async function deleteTodo(id: number) {
  const todo = await prisma.todos.delete({
    where: { id },
  });
  revalidateTag("todos", "max");
  return serializeBigInt(todo);
}
