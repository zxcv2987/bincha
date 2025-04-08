import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      { id: Number(user.id), username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    return NextResponse.json({
      message: "로그인 성공",
      token,
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong", status: 500 });
  }
}

export async function UPDATE(req: NextRequest) {
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
