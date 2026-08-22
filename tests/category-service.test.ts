import { afterAll, beforeAll, expect, test } from "vitest";
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
import { prisma, createTestUser, cleanupTestUser } from "./helpers";

let owner: { id: bigint };
let otherUser: { id: bigint };
let categoryA: { id: number };
let categoryB: { id: number };
let categoryC: { id: number };
let otherCategory: { id: number };

beforeAll(async () => {
  owner = await createTestUser("category-owner");
  otherUser = await createTestUser("category-other");

  const createdCategoryA = await prisma.category.create({
    data: { category_name: "카테고리 A", user_id: owner.id },
  });
  categoryA = { id: Number(createdCategoryA.id) };

  const createdCategoryB = await prisma.category.create({
    data: { category_name: "카테고리 B", user_id: owner.id },
  });
  categoryB = { id: Number(createdCategoryB.id) };

  const createdCategoryC = await prisma.category.create({
    data: { category_name: "카테고리 C", user_id: owner.id },
  });
  categoryC = { id: Number(createdCategoryC.id) };

  const createdOtherCategory = await prisma.category.create({
    data: { category_name: "침범용", user_id: otherUser.id },
  });
  otherCategory = { id: Number(createdOtherCategory.id) };
});

afterAll(async () => {
  await cleanupTestUser(owner.id);
  await cleanupTestUser(otherUser.id);
  await prisma.$disconnect();
});

test("카테고리 이름을 수정하면 변경된 이름이 저장된다", async () => {
  const renamed = await renameCategory({
    categoryId: categoryA.id,
    name: "카테고리 A 수정",
    userId: owner.id,
  });

  expect(renamed.category_name).toBe("카테고리 A 수정");
});

test("다른 사용자의 카테고리 이름은 수정할 수 없다", async () => {
  await expect(
    renameCategory({
      categoryId: categoryC.id,
      name: "침범",
      userId: otherUser.id,
    }),
  ).rejects.toBeInstanceOf(CategoryNotFoundError);
});

test("카테고리 순서를 사용자별로 저장한다", async () => {
  const orderedIds = [categoryB.id, categoryC.id, categoryA.id];

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
      categoryIds: [categoryA.id, otherCategory.id, categoryB.id],
      userId: owner.id,
    }),
  ).rejects.toBeInstanceOf(CategoryOrderConflictError);

  const after = await getCategories(owner.id);
  expect(after).toEqual(before);
});
