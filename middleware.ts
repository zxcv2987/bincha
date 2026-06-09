import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { authCookieOptions } from "@/lib/auth/cookie-options";

const publicPaths = ["/api/login", "/login", "/readonly"];

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
): Promise<string> {
  const res = await fetch(new URL("/api/login/refresh", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await res.json();
  if (!data.accessToken) {
    throw new Error("No access token in refresh response");
  }

  return data.accessToken;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isPublicEndpoint = publicEndpoints.some(
    (endpoint) =>
      pathname.startsWith(endpoint.path) &&
      endpoint.methods.includes(request.method),
  );
  if (isPublicEndpoint) {
    return NextResponse.next();
  }

  const accessSecret = getAccessSecret();
  if (!accessSecret) {
    console.error("JWT_SECRET is not set");
    return NextResponse.rewrite(new URL("/readonly", request.url));
  }

  const accessToken =
    request.headers.get("Authorization")?.split(" ")[1] ||
    request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (accessToken) {
    try {
      await jwtVerify(accessToken, accessSecret);
      return NextResponse.next();
    } catch (error) {
      console.error("액세스 토큰 검증 실패:", error);

      if (refreshToken) {
        try {
          const newAccessToken = await fetchNewAccessToken(
            request,
            refreshToken,
          );

          const response = NextResponse.next();
          response.cookies.set("access_token", newAccessToken, authCookieOptions);
          return response;
        } catch (refreshError) {
          console.error("리프레시 토큰 검증 실패:", refreshError);

          if (pathname.startsWith("/api/")) {
            return new NextResponse(
              JSON.stringify({
                error: "인증이 만료되었습니다. 다시 로그인해주세요.",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json" },
              },
            );
          }

          return NextResponse.rewrite(new URL("/readonly", request.url));
        }
      }

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
  }

  return NextResponse.rewrite(new URL("/readonly", request.url));
}

export const config = {
  matcher: ["/api/:path*", "/"],
};
