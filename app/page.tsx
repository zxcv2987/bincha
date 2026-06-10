import { getCachedCategories } from "@/lib/data/category";
import { getCachedTodos } from "@/lib/data/todo";
import Header from "@/features/shared/components/Header";
import TodoList from "@/features/todo/components/TodoList";
import { CategoryType } from "@/features/category/types";
import { TodoType } from "@/features/todo/types";

export default async function Home() {
  const [categories, todos] = await Promise.all([
    getCachedCategories(),
    getCachedTodos(),
  ]) as [CategoryType[], TodoType[]];
  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-4">
        <TodoList todos={todos} categories={categories} />
      </div>
    </>
  );
}
