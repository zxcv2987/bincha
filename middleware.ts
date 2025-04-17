import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "./apis/auth";
import { jwtVerify } from "jose";
// 토큰 검증이 필요하지 않은 경로
const publicPaths = ["/api/login", "/api/refresh", "/login", "/readonly"];

const publicEndpoints = [
  { path: "/api/category", methods: ["GET"] },
  { path: "/api/todos", methods: ["GET"] },
];

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

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken && !accessToken) {
    return NextResponse.redirect(new URL("/readonly", request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      // 리프레시 토큰 검증
      const secret = new TextEncoder().encode(
        process.env.JWT_REFRESH_SECRET || "",
      );
      const decoded = await jwtVerify(refreshToken, secret);
      const { accessToken: newAccessToken } =
        await refreshAccessToken(refreshToken);
      const response = NextResponse.next();
      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        path: "/",
      });
      return response;
    } catch (error) {
      console.error("Token verification failed:", error);
      return NextResponse.redirect(new URL("/readonly", request.url));
    }
  }

  return NextResponse.next();
}

// 미들웨어가 적용될 경로 설정
export const config = {
  matcher: [
    // 모든 API 라우트에 적용
    "/api/:path*",
    // /admin으로 시작하는 모든 경로에 적용
    "/",
  ],
};
