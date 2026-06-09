import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { AuthError, getStatusForAuthError } from "@/lib/auth/errors";
import {
  clearRefreshTokenOnResponse,
  setAuthTokensOnResponse,
} from "@/lib/auth/response-cookies";

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    const { accessToken } = await refreshAccessToken(refreshToken);

    const response = NextResponse.json({
      success: true,
      message: "새 액세스 토큰 발급 성공",
    });
    setAuthTokensOnResponse(response, { accessToken });
    return response;
  } catch (err) {
    if (err instanceof AuthError) {
      const response = NextResponse.json(
        { message: err.message },
        { status: getStatusForAuthError(err.code) },
      );

      if (err.code === "INVALID_TOKEN" || err.code === "MISSING_TOKEN") {
        clearRefreshTokenOnResponse(response);
      }

      return response;
    }

    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
