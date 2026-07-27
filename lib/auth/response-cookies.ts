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

export function clearAuthCookiesOnResponse(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}
