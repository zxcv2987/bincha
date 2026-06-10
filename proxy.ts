import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  clearRefreshTokenOnResponse,
  forwardSetCookieHeaders,
} from "@/lib/auth/response-cookies";
import { updateSession } from "@/utils/supabase/middleware";

const publicPaths = ["/api/login", "/login", "/readonly", "/supabase-test"];

const publicEndpoints = [
  { path: "/api/category", methods: ["GET"] },
  { path: "/api/todos", methods: ["GET"] },
];

function getAccessSecret(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

async function fetchNewAccessToken(
  request: NextRequest,
  refreshToken: string,
): Promise<Response> {
  const res = await fetch(new URL("/api/login/refresh", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh access token");
  }

  return res;
}

function authExpiredResponse(request: NextRequest, pathname: string) {
  const message = "인증이 만료되었습니다. 다시 로그인해주세요.";

  if (pathname.startsWith("/api/")) {
    const response = new NextResponse(JSON.stringify({ error: message }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
    return clearRefreshTokenOnResponse(response);
  }

  const response = NextResponse.rewrite(new URL("/readonly", request.url));
  return clearRefreshTokenOnResponse(response);
}

function applySupabaseCookies(
  response: NextResponse,
  supabaseResponse: NextResponse,
) {
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

function authRequiredResponse(request: NextRequest, pathname: string) {
  if (pathname.startsWith("/api/")) {
    return new NextResponse(
      JSON.stringify({ error: "인증이 필요합니다." }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  return NextResponse.rewrite(new URL("/readonly", request.url));
}

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return supabaseResponse;
  }

  const isPublicEndpoint = publicEndpoints.some(
    (endpoint) =>
      pathname.startsWith(endpoint.path) &&
      endpoint.methods.includes(request.method),
  );
  if (isPublicEndpoint) {
    return supabaseResponse;
  }

  const accessSecret = getAccessSecret();
  if (!accessSecret) {
    console.error("JWT_SECRET is not set");
    return applySupabaseCookies(
      NextResponse.rewrite(new URL("/readonly", request.url)),
      supabaseResponse,
    );
  }

  const accessToken =
    request.headers.get("Authorization")?.split(" ")[1] ||
    request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessSecret);
      return supabaseResponse;
    } catch (error) {
      console.error("액세스 토큰 검증 실패:", error);

      if (refreshToken) {
        try {
          const refreshResponse = await fetchNewAccessToken(
            request,
            refreshToken,
          );

          const response = NextResponse.next();
          forwardSetCookieHeaders(response, refreshResponse);
          return applySupabaseCookies(response, supabaseResponse);
        } catch (refreshError) {
          console.error("리프레시 토큰 검증 실패:", refreshError);
          return applySupabaseCookies(
            authExpiredResponse(request, pathname),
            supabaseResponse,
          );
        }
      }

      return applySupabaseCookies(
        authRequiredResponse(request, pathname),
        supabaseResponse,
      );
    }
  }

  return applySupabaseCookies(
    authRequiredResponse(request, pathname),
    supabaseResponse,
  );
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
