import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { refreshAccessToken } from "./apis/auth";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
// 토큰 검증이 필요하지 않은 경로
const publicPaths = ["/api/login", "/api/refresh", "/login", "/readonly"];

const publicEndpoints = [
  { path: "/api/category", methods: ["GET"] },
  { path: "/api/todos", methods: ["GET"] },
];

export async function middleware(request: NextRequest) {
  console.log("middleware");
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

  const cookieStore = await cookies();
  const accessToken =
    request.headers.get("Authorization")?.split(" ")[1] ||
    cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  // 액세스 토큰이 있는 경우 먼저 유효성 검증
  if (accessToken) {
    try {
      const accessSecret = new TextEncoder().encode(
        process.env.JWT_SECRET || "",
      );
      await jwtVerify(accessToken, accessSecret);
    } catch (error) {
      console.error("액세스 토큰 검증 실패:", error);

      // 액세스 토큰 만료되었고 리프레시 토큰이 있는 경우
      if (refreshToken) {
        try {
          // 리프레시 토큰 검증 및 새 액세스 토큰 발급
          const refreshSecret = new TextEncoder().encode(
            process.env.JWT_REFRESH_SECRET || "",
          );

          await jwtVerify(refreshToken, refreshSecret);
          const { accessToken: newAccessToken } =
            await refreshAccessToken(refreshToken);

          // 새 액세스 토큰으로 응답 설정
          const response = NextResponse.next();
          response.cookies.set("access_token", newAccessToken, {
            httpOnly: true,
            path: "/",
          });
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

          // API가 아닌 페이지 요청은 로그인 페이지로 리다이렉트
          return NextResponse.rewrite(new URL("/readonly", request.url));
        }
      }

      // 리프레시 토큰도 없는 경우
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
