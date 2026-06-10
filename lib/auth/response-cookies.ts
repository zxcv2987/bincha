import { NextResponse } from "next/server";
import { authCookieOptions } from "./cookie-options";

export function setAuthTokensOnResponse(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken?: string },
) {
  response.cookies.set("access_token", tokens.accessToken, authCookieOptions);
  if (tokens.refreshToken) {
    response.cookies.set(
      "refresh_token",
      tokens.refreshToken,
      authCookieOptions,
    );
  }
  return response;
}

export function clearRefreshTokenOnResponse(response: NextResponse) {
  response.cookies.delete("refresh_token");
  return response;
}

export function forwardSetCookieHeaders(
  target: NextResponse,
  fetchResponse: Response,
) {
  const rawCookies = fetchResponse.headers.getSetCookie?.() ?? [];
  for (const raw of rawCookies) {
    target.headers.append("set-cookie", raw);
  }
  return target;
}
