import { getCachedCategories } from "@/lib/data/category";
import { getCachedTodos } from "@/lib/data/todo";
import Header from "@/components/common/layout/Header";
import TodoList from "@/components/TodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";

export default async function Home() {
  const categories: CategoryType[] = await getCachedCategories();
  const todos: TodoType[] = await getCachedTodos();
  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-4">
        <TodoList todos={todos} categories={categories} />
      </div>
    </>
  );
}
