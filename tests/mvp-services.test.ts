import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, expect, test } from "vitest";
import {
  toggleTodoCompleted,
  updateTodo,
  deleteTodo,
  getTodos,
} from "@/features/todo/todo.service";
import { createTaskResult } from "@/features/result/result.service";
import { TodoNotFoundError } from "@/features/todo/todo.errors";
import {
  CompletedTodoRequiredError,
  ResultAlreadyExistsError,
} from "@/features/result/result.errors";
import {
  getCategories,
  createCategory,
  renameCategory,
  reorderCategories,
} from "@/features/category/category.service";
import {
  CategoryNotFoundError,
  CategoryOrderConflictError,
} from "@/features/category/category.errors";

const prisma = new PrismaClient();
const runId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
let owner: { id: bigint };
let otherUser: { id: bigint };
let category: { id: number };
let otherCategory: { id: number };
let activeTodo: { id: number };
let completedTodo: { id: number };
let managedCategoryA: { id: number };
let managedCategoryB: { id: number };

beforeAll(async () => {
  owner = await prisma.user.create({
    data: { username: `mvp-owner-${runId}`, password: "test-only" },
  });
  otherUser = await prisma.user.create({
    data: { username: `mvp-other-${runId}`, password: "test-only" },
  });
  const createdCategory = await prisma.category.create({
    data: { category_name: "검증", user_id: owner.id },
  });
  category = { id: Number(createdCategory.id) };

  const createdManagedCategoryA = await prisma.category.create({
    data: { category_name: "관리 A", user_id: owner.id },
  });
  managedCategoryA = { id: Number(createdManagedCategoryA.id) };

  const createdManagedCategoryB = await prisma.category.create({
    data: { category_name: "관리 B", user_id: owner.id },
  });
  managedCategoryB = { id: Number(createdManagedCategoryB.id) };

  const createdOtherCategory = await prisma.category.create({
    data: { category_name: "침범용", user_id: otherUser.id },
  });
  otherCategory = { id: Number(createdOtherCategory.id) };

  const createdActiveTodo = await prisma.todos.create({
    data: {
      title: "완료 토글 검증",
      category_id: category.id,
      user_id: owner.id,
    },
  });
  activeTodo = { id: Number(createdActiveTodo.id) };

  const createdCompletedTodo = await prisma.todos.create({
    data: {
      title: "결과 검증",
      category_id: category.id,
      user_id: owner.id,
      completed: true,
      completed_at: new Date(),
    },
  });
  completedTodo = { id: Number(createdCompletedTodo.id) };
});

afterAll(async () => {
  if (owner) {
    await prisma.task_result.deleteMany({ where: { user_id: owner.id } });
    await prisma.todos.deleteMany({ where: { user_id: owner.id } });
    await prisma.category.deleteMany({ where: { user_id: owner.id } });
    await prisma.user.deleteMany({ where: { id: owner.id } });
  }
  if (otherUser) {
    await prisma.category.deleteMany({ where: { user_id: otherUser.id } });
    await prisma.user.deleteMany({ where: { id: otherUser.id } });
  }
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

test("완료 토글은 completed와 completed_at을 함께 설정하고 해제한다", async () => {
  const completed = await toggleTodoCompleted({
    todoId: activeTodo.id,
    userId: owner.id,
  });
  expect(completed.completed).toBe(true);
  expect(completed.completed_at).toBeTruthy();

  const reopened = await toggleTodoCompleted({
    todoId: activeTodo.id,
    userId: owner.id,
  });
  expect(reopened.completed).toBe(false);
  expect(reopened.completed_at).toBeNull();
});

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

test("다른 사용자는 Todo를 조회, 수정, 삭제할 수 없다", async () => {
  const found = await getTodos(otherUser.id);
  expect(found.some((todo) => todo.id === completedTodo.id)).toBe(false);

  await expect(
    updateTodo({
      id: completedTodo.id,
      title: "침범",
      text: "",
      category_id: otherCategory.id,
      userId: otherUser.id,
    }),
  ).rejects.toBeInstanceOf(TodoNotFoundError);

  await expect(
    deleteTodo(completedTodo.id, otherUser.id),
  ).rejects.toBeInstanceOf(TodoNotFoundError);
  expect(
    await prisma.todos.findUnique({ where: { id: completedTodo.id } }),
  ).toBeTruthy();
});

test("카테고리 이름을 수정하면 변경된 이름이 저장된다", async () => {
  const renamed = await renameCategory({
    categoryId: managedCategoryA.id,
    name: "관리 수정",
    userId: owner.id,
  });

  expect(renamed.category_name).toBe("관리 수정");
});

test("다른 사용자의 카테고리 이름은 수정할 수 없다", async () => {
  await expect(
    renameCategory({
      categoryId: category.id,
      name: "침범",
      userId: otherUser.id,
    }),
  ).rejects.toBeInstanceOf(CategoryNotFoundError);
});

test("카테고리 순서를 사용자별로 저장한다", async () => {
  const orderedIds = [managedCategoryB.id, category.id, managedCategoryA.id];

  await reorderCategories({ categoryIds: orderedIds, userId: owner.id });

  const categories = await getCategories(owner.id);
  expect(categories.map(({ id }) => id)).toEqual(orderedIds);
  expect(categories.map(({ sort_order }) => sort_order)).toEqual([0, 1, 2]);
});

test("카테고리를 동시에 만들어도 서로 다른 순서가 저장된다", async () => {
  const [first, second] = await Promise.all([
    createCategory("동시 생성 A", owner.id),
    createCategory("동시 생성 B", owner.id),
  ]);

  expect(first.sort_order).not.toBe(second.sort_order);
});

test("다른 사용자의 카테고리가 순서 목록에 섞이면 전체 변경을 거부한다", async () => {
  const before = await getCategories(owner.id);

  await expect(
    reorderCategories({
      categoryIds: [
        managedCategoryA.id,
        otherCategory.id,
        managedCategoryB.id,
      ],
      userId: owner.id,
    }),
  ).rejects.toBeInstanceOf(CategoryOrderConflictError);

  const after = await getCategories(owner.id);
  expect(after).toEqual(before);
});
