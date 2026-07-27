import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "@/lib/auth/refresh";
import {
  clearAuthCookiesOnResponse,
  setAuthTokensOnResponse,
} from "@/lib/auth/response-cookies";
import { verifyAccessToken } from "@/lib/auth/tokens";

function authExpiredResponse(pathname: string) {
  if (pathname.startsWith("/api/")) {
    return clearAuthCookiesOnResponse(
      NextResponse.json(
        { error: "인증이 만료되었습니다. 다시 로그인해주세요." },
        { status: 401 },
      ),
    );
  }

  // 페이지는 각자 requireCurrentUserId로 인증을 확인하므로 그대로 통과시킨다.
  return clearAuthCookiesOnResponse(NextResponse.next());
}

function authRequiredResponse(pathname: string) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "인증이 필요합니다." },
      { status: 401 },
    );
  }
  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/login")) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (accessToken) {
    try {
      await verifyAccessToken(accessToken);
      return NextResponse.next();
    } catch (error) {
      console.error("액세스 토큰 검증 실패:", error);

      if (refreshToken) {
        try {
          const tokens = await refreshAccessToken(refreshToken);
          request.cookies.set("access_token", tokens.accessToken);
          request.cookies.set("refresh_token", tokens.refreshToken);
          const response = NextResponse.next({ request });
          return setAuthTokensOnResponse(response, tokens);
        } catch (refreshError) {
          console.error("리프레시 토큰 검증 실패:", refreshError);
          return authExpiredResponse(pathname);
        }
      }

      return clearAuthCookiesOnResponse(authRequiredResponse(pathname));
    }
  }

  if (refreshToken) {
    try {
      const tokens = await refreshAccessToken(refreshToken);
      request.cookies.set("access_token", tokens.accessToken);
      request.cookies.set("refresh_token", tokens.refreshToken);
      const response = NextResponse.next({ request });
      return setAuthTokensOnResponse(response, tokens);
    } catch (refreshError) {
      console.error("리프레시 토큰 검증 실패:", refreshError);
      return authExpiredResponse(pathname);
    }
  }

  return authRequiredResponse(pathname);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
