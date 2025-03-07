import { prisma } from "@/prisma/prismaClient";
import { serializeBigInt } from "@/utils/serialize/serializeBigInt";
import { NextResponse } from "next/server";
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;

  try {
    const { title, text, category_id, completed } = await request.json();
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (text !== undefined) updateData.text = text;
    if (category_id !== undefined) updateData.category_id = category_id;
    if (completed !== undefined) updateData.completed = completed;

    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { error: "At least one field must be provided to update." },
        { status: 400 },
      );
    }
    const todo = await prisma.todos.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
    return NextResponse.json(serializeBigInt(todo));
  } catch (error) {
    return Response.error();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  try {
    const todo = await prisma.todos.delete({
      where: {
        id: Number(id),
      },
    });
    return Response.json(serializeBigInt(todo));
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
