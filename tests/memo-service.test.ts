import { afterAll, beforeAll, expect, test } from "vitest";
import {
  createMemo,
  updateMemo,
  deleteMemo,
  getMemos,
} from "@/features/memo/memo.service";
import { MemoNotFoundError } from "@/features/memo/memo.errors";
import { prisma, createTestUser, cleanupTestUser } from "./helpers";

let owner: { id: bigint };
let otherUser: { id: bigint };

beforeAll(async () => {
  owner = await createTestUser("memo-owner");
  otherUser = await createTestUser("memo-other");
});

afterAll(async () => {
  await cleanupTestUser(owner.id);
  await cleanupTestUser(otherUser.id);
  await prisma.$disconnect();
});

test("다른 사용자는 메모를 조회, 수정, 삭제할 수 없다", async () => {
  const memo = await createMemo("검증용 메모", "", owner.id);

  const found = await getMemos(otherUser.id);
  expect(found.some((m) => m.id === memo.id)).toBe(false);

  await expect(
    updateMemo({
      id: memo.id,
      content: "침범",
      link: "",
      userId: otherUser.id,
    }),
  ).rejects.toBeInstanceOf(MemoNotFoundError);

  await expect(deleteMemo(memo.id, otherUser.id)).rejects.toBeInstanceOf(
    MemoNotFoundError,
  );
  expect(await prisma.memo.findUnique({ where: { id: memo.id } })).toBeTruthy();
});
