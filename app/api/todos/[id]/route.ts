import { deleteTodo, updateTodo } from "@/lib/services/todo";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const { title, text, category_id } = await request.json();
    const todo = await updateTodo({
      id: Number(id),
      title,
      text,
      category_id,
    });
    return NextResponse.json(todo);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "At least one field must be provided to update."
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const todo = await deleteTodo(Number(id));
    return NextResponse.json(todo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 },
    );
  }
}
