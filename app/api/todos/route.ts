import { prisma } from "@/prisma/prismaClient";
import { NextResponse } from "next/server";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    const todos = await prisma.todos.findMany({
      include: {
        category: true,
      },
      orderBy: [{ id: "asc" }, { category_id: "asc" }],
    });
    return Response.json(serializeBigInt(todos));
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}

export async function POST(request: Request) {
  try {
    const { title, text, category_id } = await request.json();
    if (!title || !text || !category_id)
      return Response.json(
        { error: "Missing required fields:" },
        { status: 400 },
      );
    const todo = await prisma.todos.create({
      data: {
        title,
        text,
        category_id,
      },
    });
    revalidateTag("todos");
    return NextResponse.json(serializeBigInt(todo));
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
