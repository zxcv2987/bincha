import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

function makeRunId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function createTestUser(prefix: string) {
  return prisma.user.create({
    data: { username: `${prefix}-${makeRunId()}`, password: "test-only" },
  });
}

export async function cleanupTestUser(userId: bigint) {
  await prisma.memo.deleteMany({ where: { user_id: userId } });
  await prisma.task_result.deleteMany({ where: { user_id: userId } });
  await prisma.todos.deleteMany({ where: { user_id: userId } });
  await prisma.category.deleteMany({ where: { user_id: userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
}
