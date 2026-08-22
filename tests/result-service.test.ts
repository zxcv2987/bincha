import { afterAll, beforeAll, expect, test } from "vitest";
import { createTaskResult } from "@/features/result/result.service";
import {
  CompletedTodoRequiredError,
  ResultAlreadyExistsError,
} from "@/features/result/result.errors";
import { prisma, createTestUser, cleanupTestUser } from "./helpers";

let owner: { id: bigint };
let activeTodo: { id: number };
let completedTodo: { id: number };

beforeAll(async () => {
  owner = await createTestUser("result-owner");

  const createdCategory = await prisma.category.create({
    data: { category_name: "검증", user_id: owner.id },
  });
  const categoryId = Number(createdCategory.id);

  const createdActiveTodo = await prisma.todos.create({
    data: { title: "미완료 할 일", category_id: categoryId, user_id: owner.id },
  });
  activeTodo = { id: Number(createdActiveTodo.id) };

  const createdCompletedTodo = await prisma.todos.create({
    data: {
      title: "결과 검증",
      category_id: categoryId,
      user_id: owner.id,
      completed: true,
      completed_at: new Date(),
    },
  });
  completedTodo = { id: Number(createdCompletedTodo.id) };
});

afterAll(async () => {
  await cleanupTestUser(owner.id);
  await prisma.$disconnect();
});

function createResult(todoId: number, userId: bigint) {
  return createTaskResult({
    todoId,
    userId,
    summary: "검증 결과",
    changeSummary: "",
    unexpected: "",
    nextAction: "",
    evidenceUrl: "",
    needsMeasurement: false,
  });
}

test("미완료 Todo에는 결과를 만들 수 없다", async () => {
  await expect(createResult(activeTodo.id, owner.id)).rejects.toBeInstanceOf(
    CompletedTodoRequiredError,
  );
});

test("같은 Todo에는 결과를 두 번 만들 수 없다", async () => {
  await createResult(completedTodo.id, owner.id);
  await expect(createResult(completedTodo.id, owner.id)).rejects.toBeInstanceOf(
    ResultAlreadyExistsError,
  );
});
