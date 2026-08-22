import { getPendingTodos, getResults } from "@/features/result/result.service";
import { TodoType } from "@/features/todo/todo.types";
import { ResultWithTodo } from "@/features/result/result.types";

export type ResultsPageDataResult =
  | { ok: true; pendingTodos: TodoType[]; completedResults: ResultWithTodo[] }
  | { ok: false; error: string };

export async function getResultsPageData(
  userId: bigint,
): Promise<ResultsPageDataResult> {
  try {
    const [pendingTodos, completedResults] = (await Promise.all([
      getPendingTodos(userId),
      getResults(userId),
    ])) as [TodoType[], ResultWithTodo[]];

    return { ok: true, pendingTodos, completedResults };
  } catch (error) {
    console.error("결과 페이지 데이터 조회 실패:", error);
    return {
      ok: false,
      error: "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
