import { getCategory } from "@/apis/category";
import { getTodos } from "@/apis/todo";
import TodoList from "@/components/todoList/TodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";

export default async function Home() {
  const categories: CategoryType[] = await getCategory();
  const todos: TodoType[] = await getTodos();

  return (
    <div className="flex w-full flex-col gap-4">
      <TodoList todos={todos} categories={categories} />
    </div>
  );
}
