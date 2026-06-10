import { getCachedCategories } from "@/lib/data/category";
import { getCachedTodos } from "@/lib/data/todo";
import Header from "@/components/common/layout/Header";
import ReadOnlyTodoList from "@/components/ReadOnlyTodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";

export default async function Page() {
  const categories: CategoryType[] = await getCachedCategories();
  const todos: TodoType[] = await getCachedTodos();
  return (
    <>
      <Header isReadOnly />
      <div className="flex w-full flex-col gap-4">
        <ReadOnlyTodoList todos={todos} categories={categories} />
      </div>
    </>
  );
}
