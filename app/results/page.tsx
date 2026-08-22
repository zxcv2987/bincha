import AppHeader from "@/features/shared/components/AppHeader";
import LoginGate from "@/features/auth/components/LoginGate";
import Sidebar from "@/features/shared/components/Sidebar";
import PendingResultCard from "@/features/result/components/PendingResultCard";
import CompletedResultCard from "@/features/result/components/CompletedResultCard";
import ListFetchError from "@/features/shared/components/ListFetchError";
import { getResultsPageData } from "./page.data";
import { requireCurrentUserId } from "@/lib/auth/session";

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

  const result = await getResultsPageData(userId);

  return (
    <>
      <AppHeader />
      <div className="flex w-full flex-col gap-6 border-t border-zinc-200 pt-6 md:flex-row md:items-start">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col gap-10">
          {!result.ok ? (
            <ListFetchError message={result.error} />
          ) : (
            <>
              <section className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-zinc-700">
                  결과 기록 대기
                </h2>
                {result.pendingTodos.length === 0 ? (
                  <p className="rounded-xl bg-zinc-50 p-4 text-zinc-500">
                    결과를 기다리는 완료 작업이 없습니다.
                  </p>
                ) : (
                  result.pendingTodos.map((todo) => (
                    <PendingResultCard key={todo.id} todo={todo} />
                  ))
                )}
              </section>

              <section className="flex flex-col gap-3">
                <h2 className="text-base font-bold text-zinc-700">
                  결과 기록 완료
                </h2>
                {result.completedResults.length === 0 ? (
                  <p className="rounded-xl bg-zinc-50 p-4 text-zinc-500">
                    아직 기록한 결과가 없습니다.
                  </p>
                ) : (
                  result.completedResults.map((r) => (
                    <CompletedResultCard key={r.id} result={r} />
                  ))
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </>
  );
}
