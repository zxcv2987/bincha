import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { TodoType } from "./types";
import { CategoryNotFoundError } from "@/features/category/category.errors";
import { TodoNotFoundError } from "./todo.errors";

async function requireOwnedCategory(categoryId: number, userId: bigint) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, user_id: userId },
  });
  if (!category) throw new CategoryNotFoundError();
}

export async function getTodos(userId: bigint): Promise<TodoType[]> {
  const todos = await prisma.todos.findMany({
    where: { user_id: userId },
    include: { category: true, result: true },
    orderBy: [{ id: "asc" }, { category_id: "asc" }],
  });
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

  const updated = await prisma.todos.updateMany({
    where: { id, user_id: userId },
    data: { title, text, category_id },
  });
  if (updated.count === 0) throw new TodoNotFoundError();
}

export async function deleteTodo(id: number, userId: bigint) {
  const deleted = await prisma.todos.deleteMany({
    where: { id, user_id: userId },
  });
  if (deleted.count === 0) throw new TodoNotFoundError();
}

export async function toggleTodoCompleted({
  todoId,
  userId,
}: {
  todoId: number;
  userId: bigint;
}) {
  const todo = await prisma.$transaction(async (tx) => {
    const existing = await tx.todos.findFirst({
      where: { id: todoId, user_id: userId },
    });
    if (!existing) throw new TodoNotFoundError();

    const completed = !existing.completed;
    return tx.todos.update({
      where: { id: existing.id },
      data: { completed, completed_at: completed ? new Date() : null },
    });
  });

  return serializeBigInt(todo);
}
