import { getCachedCategories } from "@/lib/data/category";
import { getCachedTodos } from "@/lib/data/todo";
import { CategoryType } from "@/features/category/types";
import { TodoType } from "@/features/todo/types";

export type ListDataResult =
  | { ok: true; categories: CategoryType[]; todos: TodoType[] }
  | { ok: false; error: string };

export async function getListData(): Promise<ListDataResult> {
  try {
    const [categories, todos] = await Promise.all([
      getCachedCategories(),
      getCachedTodos(),
    ]);

    return { ok: true, categories, todos };
  } catch (error) {
    console.error("목록 데이터 조회 실패:", error);
    return {
      ok: false,
      error: "데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
    };
  }
}
