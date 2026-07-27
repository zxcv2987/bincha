import Header from "@/features/shared/components/Header";
import ListFetchError from "@/features/shared/components/ListFetchError";
import ResultModalButton from "@/features/result/components/ResultModalButton";
import { getPendingTodos, getResults } from "@/features/result/result.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { TodoType } from "@/features/todo/types";
import { TaskResultType } from "@/features/result/types";

type ResultWithTodo = TaskResultType & { todo: TodoType };

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
      <main className="flex flex-col gap-10 py-8">
        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-zinc-700">결과 기록 대기</h2>
          {pendingTodos.length === 0 ? (
            <p className="rounded-xl bg-zinc-50 p-4 text-zinc-400">
              결과를 기다리는 완료 작업이 없습니다.
            </p>
          ) : (
            pendingTodos.map((todo) => (
              <article
                key={todo.id}
                className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 p-4"
              >
                <div>
                  <h3 className="font-semibold text-zinc-700">{todo.title}</h3>
                  {todo.completed_at && (
                    <p className="text-sm text-zinc-400">
                      완료일:{" "}
                      {new Date(todo.completed_at).toLocaleDateString("ko-KR")}
                    </p>
                  )}
                </div>
                <ResultModalButton todo={todo} />
              </article>
            ))
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold text-zinc-700">결과 기록 완료</h2>
          {completedResults.length === 0 ? (
            <p className="rounded-xl bg-zinc-50 p-4 text-zinc-400">
              아직 기록한 결과가 없습니다.
            </p>
          ) : (
            completedResults.map((result) => (
              <article key={result.id} className="rounded-xl bg-zinc-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-zinc-700">
                      {result.summary}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      연결된 할 일: {result.todo.title}
                    </p>
                  </div>
                  <ResultModalButton todo={result.todo} />
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
}
