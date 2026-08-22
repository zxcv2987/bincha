import { afterAll, beforeAll, expect, test } from "vitest";
import {
  toggleTodoCompleted,
  updateTodo,
  deleteTodo,
  getTodos,
  reorderTodos,
} from "@/features/todo/todo.service";
import {
  TodoNotFoundError,
  TodoOrderConflictError,
} from "@/features/todo/todo.errors";
import { CategoryNotFoundError } from "@/features/category/category.errors";
import { prisma, createTestUser, cleanupTestUser } from "./helpers";

let owner: { id: bigint };
let otherUser: { id: bigint };
let category: { id: number };
let otherCategory: { id: number };
let secondCategory: { id: number };
let activeTodo: { id: number };
let completedTodo: { id: number };
let reorderTodoC: { id: number };
let foreignCategoryTodo: { id: number };

beforeAll(async () => {
  owner = await createTestUser("todo-owner");
  otherUser = await createTestUser("todo-other");

  const createdCategory = await prisma.category.create({
    data: { category_name: "검증", user_id: owner.id },
  });
  category = { id: Number(createdCategory.id) };

  const createdSecondCategory = await prisma.category.create({
    data: { category_name: "다른 카테고리", user_id: owner.id },
  });
  secondCategory = { id: Number(createdSecondCategory.id) };

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
      title: "완료된 할 일",
      category_id: category.id,
      user_id: owner.id,
      completed: true,
      completed_at: new Date(),
    },
  });
  completedTodo = { id: Number(createdCompletedTodo.id) };

  const createdReorderTodoC = await prisma.todos.create({
    data: { title: "순서 검증 C", category_id: category.id, user_id: owner.id },
  });
  reorderTodoC = { id: Number(createdReorderTodoC.id) };

  const createdForeignCategoryTodo = await prisma.todos.create({
    data: {
      title: "다른 카테고리 할 일",
      category_id: secondCategory.id,
      user_id: owner.id,
    },
  });
  foreignCategoryTodo = { id: Number(createdForeignCategoryTodo.id) };
});

afterAll(async () => {
  await cleanupTestUser(owner.id);
  await cleanupTestUser(otherUser.id);
  await prisma.$disconnect();
});

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

test("카테고리 안에서 할 일 순서를 저장한다", async () => {
  const orderedIds = [reorderTodoC.id, activeTodo.id, completedTodo.id];

  await reorderTodos({
    categoryId: category.id,
    todoIds: orderedIds,
    userId: owner.id,
  });

  const todos = await getTodos(owner.id);
  const reordered = todos.filter((todo) => todo.category_id === category.id);
  expect(reordered.map(({ id }) => id)).toEqual(orderedIds);
  expect(reordered.map(({ sort_order }) => sort_order)).toEqual([0, 1, 2]);
});

test("다른 카테고리의 할 일이 순서 목록에 섞이면 전체 변경을 거부한다", async () => {
  const before = await getTodos(owner.id);

  await expect(
    reorderTodos({
      categoryId: category.id,
      todoIds: [activeTodo.id, foreignCategoryTodo.id, completedTodo.id],
      userId: owner.id,
    }),
  ).rejects.toBeInstanceOf(TodoOrderConflictError);

  const after = await getTodos(owner.id);
  expect(after).toEqual(before);
});

test("다른 사용자의 카테고리에 대한 할 일 순서 변경은 거부한다", async () => {
  await expect(
    reorderTodos({
      categoryId: otherCategory.id,
      todoIds: [reorderTodoC.id],
      userId: owner.id,
    }),
  ).rejects.toBeInstanceOf(CategoryNotFoundError);
});
