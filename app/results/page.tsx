import Header from "@/features/shared/components/Header";
import Sidebar from "@/features/shared/components/Sidebar";
import ListFetchError from "@/features/shared/components/ListFetchError";
import PendingTodoCard from "@/features/result/components/PendingTodoCard";
import CompletedResultCard from "@/features/result/components/CompletedResultCard";
import { getPendingTodos, getResults } from "@/features/result/result.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { TodoType } from "@/features/todo/types";
import { ResultWithTodo } from "@/features/result/types";

export default async function ResultsPage() {
  let userId: bigint;
  try {
    userId = await requireCurrentUserId();
  } catch {
    return (
      <>
        <Header />
        <ListFetchError message="로그인 후 결과함을 확인할 수 있습니다." />
      </>
    );
  }

  const [pendingTodos, completedResults] = (await Promise.all([
    getPendingTodos(userId),
    getResults(userId),
  ])) as [TodoType[], ResultWithTodo[]];

  return (
    <>
      <Header />
      <div className="flex w-full flex-col gap-6 border-t border-zinc-200 pt-6 md:flex-row md:items-start">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-10">
          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-zinc-700">
              결과 기록 대기
            </h2>
            {pendingTodos.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-4 text-zinc-400">
                결과를 기다리는 완료 작업이 없습니다.
              </p>
            ) : (
              pendingTodos.map((todo) => (
                <PendingTodoCard key={todo.id} todo={todo} />
              ))
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold text-zinc-700">
              결과 기록 완료
            </h2>
            {completedResults.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-4 text-zinc-400">
                아직 기록한 결과가 없습니다.
              </p>
            ) : (
              completedResults.map((result) => (
                <CompletedResultCard key={result.id} result={result} />
              ))
            )}
          </section>
        </main>
      </div>
    </>
  );
}
