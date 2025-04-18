import { getCategory } from "@/apis/category";
import { getTodos } from "@/apis/todo";
import Header from "@/components/common/layout/Header";
import ReadOnlyTodoList from "@/components/ReadOnlyTodoList";
import { CategoryType } from "@/types/category";
import { TodoType } from "@/types/todos";

export default async function Page() {
  const categories: CategoryType[] = await getCategory();
  const todos: TodoType[] = await getTodos();
  return (
    <>
      <Header isReadOnly />
      <div className="flex w-full flex-col gap-4">
        <ReadOnlyTodoList todos={todos} categories={categories} />
      </div>
    </>
  );
}
