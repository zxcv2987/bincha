import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import {
  deleteOwnedTodo,
  getTodosForUser,
  toggleOwnedTodoCompleted,
  updateOwnedTodo,
} from "../features/todo/todo.persistence.mjs";
import { createCheckedTaskResult } from "../features/result/result.persistence.mjs";

const prisma = new PrismaClient();
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let owner;
let otherUser;
let category;
let activeTodo;
let completedTodo;

before(async () => {
  owner = await prisma.user.create({
    data: { username: `mvp-owner-${runId}`, password: "test-only" },
  });
  otherUser = await prisma.user.create({
    data: { username: `mvp-other-${runId}`, password: "test-only" },
  });
  category = await prisma.category.create({
    data: { category_name: "검증", user_id: owner.id },
  });
  activeTodo = await prisma.todos.create({
    data: {
      title: "완료 토글 검증",
      category_id: category.id,
      user_id: owner.id,
    },
  });
  completedTodo = await prisma.todos.create({
    data: {
      title: "결과 검증",
      category_id: category.id,
      user_id: owner.id,
      completed: true,
      completed_at: new Date(),
    },
  });
});

after(async () => {
  if (owner) {
    await prisma.task_result.deleteMany({ where: { user_id: owner.id } });
    await prisma.todos.deleteMany({ where: { user_id: owner.id } });
    await prisma.category.deleteMany({ where: { user_id: owner.id } });
    await prisma.user.deleteMany({ where: { id: owner.id } });
  }
  if (otherUser) {
    await prisma.user.deleteMany({ where: { id: otherUser.id } });
  }
  await prisma.$disconnect();
});

class TodoNotFoundError extends Error {}
class CompletedTodoRequiredError extends Error {}
class ResultAlreadyExistsError extends Error {}

function createResult(todoId, userId) {
  return createCheckedTaskResult(
    prisma,
    { todoId, userId, data: { summary: "검증 결과" } },
    {
      CompletedRequiredError: CompletedTodoRequiredError,
      AlreadyExistsError: ResultAlreadyExistsError,
    },
  );
}

test("완료 토글은 completed와 completed_at을 함께 설정하고 해제한다", async () => {
  const completed = await toggleOwnedTodoCompleted(
    prisma,
    { todoId: activeTodo.id, userId: owner.id },
    TodoNotFoundError,
  );
  assert.equal(completed.completed, true);
  assert.ok(completed.completed_at instanceof Date);

  const reopened = await toggleOwnedTodoCompleted(
    prisma,
    { todoId: activeTodo.id, userId: owner.id },
    TodoNotFoundError,
  );
  assert.equal(reopened.completed, false);
  assert.equal(reopened.completed_at, null);
});

test("미완료 Todo에는 결과를 만들 수 없다", async () => {
  await assert.rejects(
    createResult(activeTodo.id, owner.id),
    CompletedTodoRequiredError,
  );
});

test("같은 Todo에는 결과를 두 번 만들 수 없다", async () => {
  await createResult(completedTodo.id, owner.id);
  await assert.rejects(
    createResult(completedTodo.id, owner.id),
    ResultAlreadyExistsError,
  );
});

test("다른 사용자는 Todo를 조회, 수정, 삭제할 수 없다", async () => {
  const found = await getTodosForUser(prisma, otherUser.id);
  assert.equal(
    found.some((todo) => todo.id === completedTodo.id),
    false,
  );

  await assert.rejects(
    updateOwnedTodo(
      prisma,
      {
        id: completedTodo.id,
        userId: otherUser.id,
        data: { title: "침범" },
      },
      TodoNotFoundError,
    ),
    TodoNotFoundError,
  );

  await assert.rejects(
    deleteOwnedTodo(
      prisma,
      { id: completedTodo.id, userId: otherUser.id },
      TodoNotFoundError,
    ),
    TodoNotFoundError,
  );
  assert.ok(await prisma.todos.findUnique({ where: { id: completedTodo.id } }));
});
