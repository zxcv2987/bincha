import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import { MemoType } from "./memo.types";
import { MemoNotFoundError } from "./memo.errors";

export async function getMemos(userId: bigint): Promise<MemoType[]> {
  const memos = await prisma.memo.findMany({
    where: { user_id: userId },
    orderBy: { id: "desc" },
    select: {
      id: true,
      created_at: true,
      content: true,
      link: true,
    },
  });
  return serializeBigInt(memos);
}

export async function createMemo(
  content: string,
  link: string,
  userId: bigint,
) {
  const memo = await prisma.memo.create({
    data: { content, link, user_id: userId },
    select: {
      id: true,
      created_at: true,
      content: true,
      link: true,
    },
  });
  return serializeBigInt(memo);
}

export async function updateMemo({
  id,
  content,
  link,
  userId,
}: {
  id: number;
  content: string;
  link: string;
  userId: bigint;
}) {
  const updated = await prisma.memo.updateMany({
    where: { id, user_id: userId },
    data: { content, link },
  });
  if (updated.count === 0) throw new MemoNotFoundError();
}

export async function deleteMemo(id: number, userId: bigint) {
  const deleted = await prisma.memo.deleteMany({
    where: { id, user_id: userId },
  });
  if (deleted.count === 0) throw new MemoNotFoundError();
}
