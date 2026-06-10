import { jwtVerify, SignJWT } from "jose";
import { getAccessSecret, getRefreshSecret } from "./env";
import { AuthError } from "./errors";

type AuthUser = {
  id: bigint;
  username: string;
};

export async function createAccessToken(user: AuthUser) {
  return new SignJWT({
    id: Number(user.id),
    username: user.username,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30m")
    .sign(getAccessSecret());
}

export async function createRefreshToken(userId: number) {
  return new SignJWT({
    id: userId,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(getRefreshSecret());
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, getAccessSecret());

  if (payload.type !== "access") {
    throw new AuthError("INVALID_TOKEN", "Invalid token type");
  }

  return payload;
}

export async function verifyRefreshToken(token: string) {
  return jwtVerify(token, getRefreshSecret());
}
