import { getCategoryServerAction } from "@/actions/category";
import { getTodosServerAction } from "@/actions/todo";
import TodoList from "@/components/todoList/TodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import Link from "next/link";

export default async function Home() {
  const categories: CategoryType[] = await (
    await getCategoryServerAction()
  ).json();
  const todos: TodoType[] = await (await getTodosServerAction()).json();
  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/" className="py-4 text-4xl font-semibold">
        내가 해야 할 일
      </Link>
      <TodoList todos={todos} categories={categories} />
    </div>
  );
}
