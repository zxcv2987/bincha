import Header from "@/features/shared/components/Header";
import TodoList from "@/features/todo/components/TodoList";
import { CategoryType } from "@/features/category/types";
import { TodoType } from "@/features/todo/types";

const demoCategories: CategoryType[] = [
  { id: 1, created_at: new Date("2026-07-27"), category_name: "개발" },
];

const demoTodos: TodoType[] = [
  {
    id: 1,
    created_at: new Date("2026-07-27"),
    title: "로그인 E2E 테스트 작성",
    text: "로그인 주요 시나리오를 자동화한다.",
    category_id: 1,
    category: demoCategories[0],
  },
];

export default function Page() {
  return (
    <>
      <Header isReadOnly />
      <div className="flex w-full flex-col gap-4">
        <TodoList todos={demoTodos} categories={demoCategories} isReadOnly />
      </div>
    </>
  );
}
