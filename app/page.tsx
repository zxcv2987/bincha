import { getCategory } from "@/apis/category";
import { getTodos } from "@/apis/todo";
import TodoList from "@/components/todoList/TodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";
import Link from "next/link";

export default async function Home() {
  const categories: CategoryType[] = await getCategory();
  const todos: TodoType[] = await getTodos();
  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/" className="py-4 text-4xl font-semibold">
        내가 해야 할 일
      </Link>
      <TodoList todos={todos} categories={categories} />
    </div>
  );
}
