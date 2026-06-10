import bcrypt from "bcrypt";
import { prisma } from "@/lib/db/prisma";
import { AuthError } from "./errors";
import { createAccessToken, createRefreshToken } from "./tokens";

export async function authenticateAndIssueTokens(password: string) {
  const user = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!user) {
    throw new AuthError("INVALID_CREDENTIALS", "Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
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
