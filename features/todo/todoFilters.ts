export type CompletionFilter = "all" | "active" | "completed";

const COMPLETION_FILTER_LABELS: Record<CompletionFilter, string> = {
  all: "전체",
  active: "진행 중",
  completed: "완료",
};

export const COMPLETION_FILTERS = Object.entries(
  COMPLETION_FILTER_LABELS,
) as [CompletionFilter, string][];

export function filterTodosByCompletion<T extends { completed: boolean }>(
  todos: T[],
  filter: CompletionFilter,
) {
  if (filter === "active") return todos.filter((todo) => !todo.completed);
  if (filter === "completed") return todos.filter((todo) => todo.completed);
  return todos;
}

export function getTodoFilterSummary(
  completionFilter: CompletionFilter,
  categoryId: number | null,
  categories: { id: number; category_name: string }[],
) {
  const categoryLabel =
    categories.find((category) => category.id === categoryId)?.category_name ??
    "전체 카테고리";

  return `${COMPLETION_FILTER_LABELS[completionFilter]} · ${categoryLabel}`;
}
