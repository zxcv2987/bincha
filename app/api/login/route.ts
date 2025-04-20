import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials", status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials", status: 401 });
    }

    // 액세스 토큰 생성 (짧은 만료시간)
    const accessToken = await new SignJWT({
      id: Number(user.id),
      username: user.username,
      type: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET as string));

    // 리프레시 토큰 생성 (긴 만료시간)
    const refreshToken = await new SignJWT({
      id: Number(user.id),
      type: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(process.env.JWT_REFRESH_SECRET as string));

    // 리프레시 토큰을 데이터베이스에 저장
    await prisma.user.update({
      where: { id: user.id },
      data: {
        refresh_token: refreshToken,
      },
    });

    return NextResponse.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password || password.length < 4) {
      return NextResponse.json({
        message: "비밀번호는 4자리 이상이야 합니다",
        status: 400,
      });
    }

    const hash_password = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { username: "admin" },
      data: {
        password: hash_password,
      },
    });

    return NextResponse.json({ message: "비밀번호 변경 성공", status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}
