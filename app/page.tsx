import { getTodoBoardData } from "@/app/page.data";
import Header from "@/features/shared/components/Header";
import LoginGate from "@/features/auth/components/LoginGate";
import ListFetchError from "@/features/shared/components/ListFetchError";
import TodoList from "@/features/todo/components/TodoList";
import { requireCurrentUserId } from "@/lib/auth/session";

export default async function Home() {
  let userId: bigint;
  try {
    userId = await requireCurrentUserId();
  } catch {
    return (
      <>
        <Header showLoginAction={false} />
        <LoginGate />
      </>
    );
  }
  const result = await getTodoBoardData(userId);

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
