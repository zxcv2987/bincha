import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/prisma";
import { AuthError } from "./errors";

export function isBcryptHash(value: string) {
  return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
}

export async function verifyPassword(plain: string, stored: string) {
  if (isBcryptHash(stored)) {
    return bcrypt.compare(plain, stored);
  }
  // ponytail: 예전 평문 저장 호환. 로그인 성공 시 해시로 승격.
  return plain === stored;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function changePassword(userId: bigint, newPassword: string) {
  if (!newPassword || newPassword.length < 4) {
    throw new AuthError("INVALID_PASSWORD", "비밀번호는 4자리 이상이야 합니다");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { password: await hashPassword(newPassword) },
  });
}
