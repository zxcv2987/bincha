import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { Prisma } from "@prisma/client";
import { CategoryType } from "./category.types";
import {
  CategoryAlreadyExistsError,
  CategoryHasTodosError,
  CategoryNotFoundError,
  CategoryOrderConflictError,
} from "./category.errors";

export async function getCategories(userId: bigint): Promise<CategoryType[]> {
  const categories = await prisma.category.findMany({
    where: { user_id: userId },
    orderBy: [{ sort_order: "asc" }, { id: "asc" }],
  });
  return serializeBigInt(categories);
}

export async function createCategory(
  category_name: string,
  userId: bigint,
): Promise<CategoryType> {
  try {
    const category = await prisma.$transaction(async (transaction) => {
      await lockCategoryMutations(transaction, userId);
      const lastCategory = await transaction.category.findFirst({
        where: { user_id: userId },
        orderBy: [{ sort_order: "desc" }, { id: "desc" }],
        select: { sort_order: true },
      });

      return transaction.category.create({
        data: {
          category_name,
          user_id: userId,
          sort_order: (lastCategory?.sort_order ?? -1) + 1,
        },
      });
    });
    return serializeBigInt(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CategoryAlreadyExistsError();
    }
    throw error;
  }
}

export async function renameCategory({
  categoryId,
  name,
  userId,
}: {
  categoryId: number;
  name: string;
  userId: bigint;
}): Promise<CategoryType> {
  try {
    const category = await prisma.$transaction(async (transaction) => {
      const updated = await transaction.category.updateMany({
        where: { id: categoryId, user_id: userId },
        data: { category_name: name },
      });
      if (updated.count === 0) throw new CategoryNotFoundError();

      return transaction.category.findUniqueOrThrow({
        where: { id: categoryId },
      });
    });
    return serializeBigInt(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new CategoryAlreadyExistsError();
    }
    throw error;
  }
}

export async function reorderCategories({
  categoryIds,
  userId,
}: {
  categoryIds: number[];
  userId: bigint;
}): Promise<void> {
  if (new Set(categoryIds).size !== categoryIds.length) {
    throw new CategoryOrderConflictError();
  }

  await prisma.$transaction(async (transaction) => {
    await lockCategoryMutations(transaction, userId);
    const ownedCategories = await transaction.category.findMany({
      where: { user_id: userId },
      select: { id: true },
    });
    const ownedIds = new Set(ownedCategories.map(({ id }) => Number(id)));

    if (
      ownedIds.size !== categoryIds.length ||
      categoryIds.some((id) => !ownedIds.has(id))
    ) {
      throw new CategoryOrderConflictError();
    }

    for (const [sortOrder, id] of categoryIds.entries()) {
      const updated = await transaction.category.updateMany({
          where: { id, user_id: userId },
          data: { sort_order: sortOrder },
      });
      if (updated.count !== 1) throw new CategoryOrderConflictError();
    }
  });
}

export async function deleteCategory(
  id: number,
  userId: bigint,
): Promise<void> {
  await prisma.$transaction(async (transaction) => {
    await lockCategoryMutations(transaction, userId);
    // 스키마상 todos.category는 onDelete: Restrict라 할 일이 남아있으면
    // DB가 삭제를 거부한다. 사전에 개수를 확인해 구체적인 이유를 알려준다.
    const todoCount = await transaction.todos.count({
      where: { category_id: id, user_id: userId },
    });
    if (todoCount > 0) throw new CategoryHasTodosError(todoCount);

    const deleted = await transaction.category.deleteMany({
      where: { id, user_id: userId },
    });
    if (deleted.count === 0) throw new CategoryNotFoundError();
  });
}

async function lockCategoryMutations(
  transaction: Prisma.TransactionClient,
  userId: bigint,
) {
  await transaction.$queryRaw`SELECT pg_advisory_xact_lock(${userId})::text`;
}
