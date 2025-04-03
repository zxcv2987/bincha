import { getCategory } from "@/apis/category";
import { getTodos } from "@/apis/todo";
import ReadOnlyTodoList from "@/components/ReadOnlyTodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";

export default async function Home() {
  const categories: CategoryType[] = await getCategory();
  const todos: TodoType[] = await getTodos();

  console.log("read");
  return (
    <div className="flex w-full flex-col gap-4">
      <ReadOnlyTodoList todos={todos} categories={categories} />
    </div>
  );
}
