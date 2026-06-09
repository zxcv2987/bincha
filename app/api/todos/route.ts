import { createTodo, getTodos } from "@/lib/services/todo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const todos = await getTodos();
    return NextResponse.json(todos);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { title, text, category_id } = await request.json();

    if (!title || !text || !category_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const todo = await createTodo(title, text, category_id);
    return NextResponse.json(todo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 },
    );
  }
}
