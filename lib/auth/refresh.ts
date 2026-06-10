import { prisma } from "@/prisma/prismaClient";
import { AuthError } from "./errors";
import { createAccessToken, verifyRefreshToken } from "./tokens";

export async function refreshAccessToken(refreshToken: string) {
  if (!refreshToken) {
    throw new AuthError("MISSING_TOKEN", "리프레시 토큰이 없습니다");
  }

  let payload;
  try {
    const decoded = await verifyRefreshToken(refreshToken);
    payload = decoded.payload;
  } catch {
    throw new AuthError(
      "INVALID_TOKEN",
      "리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
    );
  }

  if (payload.type !== "refresh") {
    throw new AuthError(
      "INVALID_TOKEN",
      "리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
    );
  }

  const userId = BigInt(payload.id as number);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.refresh_token !== refreshToken) {
    if (user) {
      await revokeRefreshToken(user.id);
    }
    throw new AuthError(
      "INVALID_TOKEN",
      "리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
    );
  }

  const accessToken = await createAccessToken(user);
  return { accessToken };
}

export async function revokeRefreshToken(userId: bigint) {
  await prisma.user.update({
    where: { id: userId },
    data: { refresh_token: "" },
  });
}
