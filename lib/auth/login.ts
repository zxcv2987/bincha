import { prisma } from "@/lib/db/prisma";
import { getAdminPassword } from "./env";
import { AuthError } from "./errors";
import { createAccessToken, createRefreshToken } from "./tokens";

export async function authenticateAndIssueTokens(password: string) {
  if (password !== getAdminPassword()) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials");
  }

  const user = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!user) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials");
  }

  const accessToken = await createAccessToken(user);
  const refreshToken = await createRefreshToken(Number(user.id));

  await prisma.user.update({
    where: { id: user.id },
    data: { refresh_token: refreshToken },
  });

  return { accessToken, refreshToken };
}
