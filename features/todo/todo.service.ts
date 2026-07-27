import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { revalidatePath } from "next/cache";
import { TodoType } from "./types";
import { CategoryNotFoundError } from "@/features/category/category.errors";
import { TodoNotFoundError } from "./todo.errors";
import {
  deleteOwnedTodo,
  getTodosForUser,
  toggleOwnedTodoCompleted,
  updateOwnedTodo,
} from "./todo.persistence.mjs";

async function requireOwnedCategory(categoryId: number, userId: bigint) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, user_id: userId },
  });
  if (!category) throw new CategoryNotFoundError();
}

export async function getTodos(userId: bigint): Promise<TodoType[]> {
  const todos = await getTodosForUser(prisma, userId);
  return serializeBigInt(todos);
}

export async function createTodo(
  title: string,
  text: string,
  category_id: number,
  userId: bigint,
) {
  if (!title || !category_id) {
    throw new Error("Missing required fields");
  }

  await requireOwnedCategory(category_id, userId);

  const todo = await prisma.todos.create({
    data: { title, text, category_id, user_id: userId },
  });
  revalidatePath("/");
  return serializeBigInt(todo);
}

export async function updateTodo({
  id,
  title,
  text,
  category_id,
  userId,
}: {
  id: number;
  title: string;
  text: string;
  category_id: number;
  userId: bigint;
}) {
  await requireOwnedCategory(category_id, userId);
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (text !== undefined) updateData.text = text;
  if (category_id !== undefined) updateData.category_id = category_id;

  if (Object.keys(updateData).length === 0) {
    throw new Error("At least one field must be provided to update.");
  }

  const todo = await updateOwnedTodo(
    prisma,
    { id, userId, data: updateData },
    TodoNotFoundError,
  );
  revalidatePath("/");
  return serializeBigInt(todo);
}

export async function deleteTodo(id: number, userId: bigint) {
  await deleteOwnedTodo(prisma, { id, userId }, TodoNotFoundError);
  revalidatePath("/");
}

export async function toggleTodoCompleted({
  todoId,
  userId,
}: {
  todoId: number;
  userId: bigint;
}) {
  const todo = await toggleOwnedTodoCompleted(
    prisma,
    { todoId, userId },
    TodoNotFoundError,
  );

  revalidatePath("/");
  return serializeBigInt(todo);
}
