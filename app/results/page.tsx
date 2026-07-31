import AppHeader from "@/features/shared/components/AppHeader";
import LoginGate from "@/features/auth/components/LoginGate";
import Sidebar from "@/features/shared/components/Sidebar";
import PendingResultCard from "@/features/result/components/PendingResultCard";
import CompletedResultCard from "@/features/result/components/CompletedResultCard";
import { getPendingTodos, getResults } from "@/features/result/result.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { TodoType } from "@/features/todo/todo.types";
import { ResultWithTodo } from "@/features/result/result.types";

export default async function ResultsPage() {
  let userId: bigint;
  try {
    userId = await requireCurrentUserId();
  } catch {
    return (
      <>
        <AppHeader />
        <LoginGate />
      </>
    );
  }

  const [pendingTodos, completedResults] = (await Promise.all([
    getPendingTodos(userId),
    getResults(userId),
  ])) as [TodoType[], ResultWithTodo[]];

  return (
    <>
      <AppHeader />
      <div className="flex w-full flex-col gap-6 border-t border-zinc-200 pt-6 md:flex-row md:items-start">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-10">
          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-zinc-700">
              결과 기록 대기
            </h2>
            {pendingTodos.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-4 text-zinc-500">
                결과를 기다리는 완료 작업이 없습니다.
              </p>
            ) : (
              pendingTodos.map((todo) => (
                <PendingResultCard key={todo.id} todo={todo} />
              ))
            )}
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-zinc-700">
              결과 기록 완료
            </h2>
            {completedResults.length === 0 ? (
              <p className="rounded-xl bg-zinc-50 p-4 text-zinc-500">
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
