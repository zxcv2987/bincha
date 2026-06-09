import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { revalidateTag } from "next/cache";
import { CategoryType } from "@/types/category";

export async function getCategories(): Promise<CategoryType[]> {
  const categories = await prisma.category.findMany({
    orderBy: [{ id: "asc" }],
  });
  return serializeBigInt(categories);
}

export async function createCategory(
  category_name: string,
): Promise<CategoryType> {
  const category = await prisma.category.create({
    data: { category_name },
  });
  revalidateTag("category");
  return serializeBigInt(category);
}

export async function deleteCategory(id: number): Promise<CategoryType> {
  const category = await prisma.category.delete({
    where: { id },
  });
  revalidateTag("category");
  return serializeBigInt(category);
}
