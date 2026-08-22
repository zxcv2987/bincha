import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { Prisma } from "@prisma/client";
import { TodoType } from "./todo.types";
import { CategoryNotFoundError } from "@/features/category/category.errors";
import { TodoNotFoundError, TodoOrderConflictError } from "./todo.errors";

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
    orderBy: [{ category_id: "asc" }, { sort_order: "asc" }, { id: "asc" }],
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

  const todo = await prisma.$transaction(async (transaction) => {
    await lockTodoMutations(transaction, userId);
    const lastTodo = await transaction.todos.findFirst({
      where: { user_id: userId, category_id },
      orderBy: [{ sort_order: "desc" }, { id: "desc" }],
      select: { sort_order: true },
    });

    return transaction.todos.create({
      data: {
        title,
        text,
        category_id,
        user_id: userId,
        sort_order: (lastTodo?.sort_order ?? -1) + 1,
      },
    });
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

  await prisma.$transaction(async (transaction) => {
    const existing = await transaction.todos.findFirst({
      where: { id, user_id: userId },
    });
    if (!existing) throw new TodoNotFoundError();

    const data: Prisma.todosUpdateInput = { title, text };
    const categoryChanged = Number(existing.category_id) !== category_id;

    if (categoryChanged) {
      await lockTodoMutations(transaction, userId);
      const lastTodo = await transaction.todos.findFirst({
        where: {
          user_id: userId,
          category_id,
          NOT: { id: existing.id },
        },
        orderBy: [{ sort_order: "desc" }, { id: "desc" }],
        select: { sort_order: true },
      });
      data.category = { connect: { id: category_id } };
      data.sort_order = (lastTodo?.sort_order ?? -1) + 1;
    } else {
      data.category = { connect: { id: category_id } };
    }

    await transaction.todos.update({
      where: { id: existing.id },
      data,
    });
  });
}

export async function reorderTodos({
  categoryId,
  todoIds,
  userId,
}: {
  categoryId: number;
  todoIds: number[];
  userId: bigint;
}): Promise<void> {
  if (new Set(todoIds).size !== todoIds.length) {
    throw new TodoOrderConflictError();
  }

  await prisma.$transaction(async (transaction) => {
    await lockTodoMutations(transaction, userId);

    const category = await transaction.category.findFirst({
      where: { id: categoryId, user_id: userId },
      select: { id: true },
    });
    if (!category) throw new CategoryNotFoundError();

    const ownedTodos = await transaction.todos.findMany({
      where: { user_id: userId, category_id: categoryId },
      select: { id: true },
    });
    const ownedIds = new Set(ownedTodos.map(({ id }) => Number(id)));

    if (
      ownedIds.size !== todoIds.length ||
      todoIds.some((id) => !ownedIds.has(id))
    ) {
      throw new TodoOrderConflictError();
    }

    for (const [sortOrder, id] of todoIds.entries()) {
      const updated = await transaction.todos.updateMany({
        where: { id, user_id: userId, category_id: categoryId },
        data: { sort_order: sortOrder },
      });
      if (updated.count !== 1) throw new TodoOrderConflictError();
    }
  });
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

async function lockTodoMutations(
  transaction: Prisma.TransactionClient,
  userId: bigint,
) {
  // ponytail: user-scoped lock; per-category locks if contention matters
  await transaction.$queryRaw`SELECT pg_advisory_xact_lock(${userId})::text`;
}
