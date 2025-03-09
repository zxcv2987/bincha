import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import FetchClient from "./fetchClient";
import { CategoryType } from "@/types/category";
import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from "next/server";

export async function getCategory(): Promise<Response> {
  try {
    const category = await prisma.category.findMany({
      orderBy: [{ id: "asc" }],
    });

    return NextResponse.json(serializeBigInt(category));
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function createCategory(
  category_name: string,
): Promise<CategoryType> {
  return await FetchClient("/api/category", {
    method: "POST",
    body: JSON.stringify({
      category_name,
    }),
  });
}

export async function deleteCategory(id: number) {
  return await FetchClient(`/api/category/${id}`, {
    method: "DELETE",
  });
}
