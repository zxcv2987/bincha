"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 쿠키에서 리프레시 토큰 가져오기
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      return NextResponse.json({
        message: "리프레시 토큰이 없습니다",
        status: 401,
      });
    }

    // 리프레시 토큰 검증
    try {
      const decoded = await jwtVerify(
        refreshToken,
        new TextEncoder().encode(process.env.JWT_REFRESH_SECRET as string),
      );
      console.log(decoded);

      // 토큰 타입이 리프레시인지 확인
      if (decoded.payload.type !== "refresh") {
        throw new Error("Invalid token type");
      }

      // 데이터베이스에서 사용자 조회 및 저장된 리프레시 토큰 확인
      const user = await prisma.user.findUnique({
        where: { id: BigInt(decoded.payload.id as string) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.refresh_token !== refreshToken) {
        throw new Error("Invalid refresh token");
      }

      // 새 액세스 토큰 발급
      const newAccessToken = await new SignJWT({
        id: Number(user.id),
        username: user.username,
        type: "access",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("30m")
        .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

      return NextResponse.json({
        message: "새 액세스 토큰 발급 성공",
        accessToken: newAccessToken,
        status: 200,
      });
    } catch (error) {
      // 토큰이 유효하지 않거나 만료된 경우
      console.error("리프레시 토큰 검증 실패:", error);

      // 쿠키에서 리프레시 토큰 제거
      (await cookies()).delete("refresh_token");

      return NextResponse.json({
        message: "리프레시 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
        status: 401,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
