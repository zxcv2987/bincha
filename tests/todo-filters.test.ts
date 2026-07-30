import { describe, expect, it } from "vitest";
import {
  filterTodosByCompletion,
  getTodoFilterSummary,
} from "@/features/todo/todoFilters";

const todos = [
  { id: 1, completed: false },
  { id: 2, completed: true },
  { id: 3, completed: false },
];

describe("할 일 필터", () => {
  it("완료 상태에 맞는 할 일만 반환한다", () => {
    expect(filterTodosByCompletion(todos, "active")).toEqual([
      todos[0],
      todos[2],
    ]);
    expect(filterTodosByCompletion(todos, "completed")).toEqual([todos[1]]);
    expect(filterTodosByCompletion(todos, "all")).toEqual(todos);
  });

  it("선택한 완료 상태와 카테고리를 요약한다", () => {
    expect(getTodoFilterSummary("active", null, [])).toBe(
      "진행 중 · 전체 카테고리",
    );
    expect(
      getTodoFilterSummary("completed", 2, [
        { id: 1, category_name: "개인" },
        { id: 2, category_name: "업무" },
      ]),
    ).toBe("완료 · 업무");
  });
});
