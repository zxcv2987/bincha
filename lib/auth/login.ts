import { prisma } from "@/lib/db/prisma";
import { AuthError } from "./errors";
import { hashPassword, isBcryptHash, verifyPassword } from "./password";
import { createAccessToken, createRefreshToken } from "./tokens";

export async function authenticateAndIssueTokens(password: string) {
  const user = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials");
  }

  const accessToken = await createAccessToken(user);
  const refreshToken = await createRefreshToken(Number(user.id));

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refresh_token: refreshToken,
      ...(!isBcryptHash(user.password) && {
        password: await hashPassword(password),
      }),
    },
  });

  return { accessToken, refreshToken };
}
