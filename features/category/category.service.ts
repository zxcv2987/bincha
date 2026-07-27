import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { Prisma } from "@prisma/client";
import { CategoryType } from "./types";
import {
  CategoryAlreadyExistsError,
  CategoryNotFoundError,
} from "./category.errors";

export async function getCategories(userId: bigint): Promise<CategoryType[]> {
  const categories = await prisma.category.findMany({
    where: { user_id: userId },
    orderBy: [{ id: "asc" }],
  });
  return serializeBigInt(categories);
}

export async function createCategory(
  category_name: string,
  userId: bigint,
): Promise<CategoryType> {
  try {
    const category = await prisma.category.create({
      data: { category_name, user_id: userId },
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

export async function deleteCategory(
  id: number,
  userId: bigint,
): Promise<void> {
  const deleted = await prisma.category.deleteMany({
    where: { id, user_id: userId },
  });
  if (deleted.count === 0) throw new CategoryNotFoundError();
}
