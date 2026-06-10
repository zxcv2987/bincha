import { getListData } from "@/lib/data/list";
import Header from "@/features/shared/components/Header";
import ListFetchError from "@/features/shared/components/ListFetchError";
import TodoList from "@/features/todo/components/TodoList";

export default async function Home() {
  const result = await getListData();

  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-4">
        {result.ok ? (
          <TodoList todos={result.todos} categories={result.categories} />
        ) : (
          <ListFetchError message={result.error} />
        )}
      </div>
    </>
  );
}
