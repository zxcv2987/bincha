import bcrypt from "bcrypt";
import { prisma } from "@/prisma/prismaClient";
import { AuthError } from "./errors";

export async function changePassword(userId: bigint, newPassword: string) {
  if (!newPassword || newPassword.length < 4) {
    throw new AuthError("INVALID_PASSWORD", "비밀번호는 4자리 이상이야 합니다");
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  });
}
