"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { login } from "@/apis/auth";

export async function getUserRole() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return (decoded as any).username || "";
  } catch (e) {
    return;
  }
}

export async function loginAction(state: any, formData: FormData) {
  const password = formData.get("password") as string;
  if (password === null || password === "") {
    return { ok: false, error: "비밀번호를 입력해 주세요" };
  }

  try {
    const res = await login(password);

    if (res.status !== 200) return { ok: false, error: "로그인 실패" };

    return { ok: true, token: res.token };
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return { ok: false, error: "로그인 실패" };
  }
}

export async function setCookieAction(token: string) {
  try {
    (await cookies()).set("token", token, { httpOnly: true, secure: true });
  } catch (error) {
    console.log(error);
  }
}
export async function logout() {
  try {
    (await cookies()).delete("token");
  } catch (error) {
    console.log(error);
  }
}
