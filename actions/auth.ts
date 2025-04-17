"use server";

import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { login } from "@/apis/auth";
import { redirect } from "next/navigation";

export async function getUserRole() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(accessToken, secret);

    if (payload.type !== "access") return null;

    return payload.username as string;
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return null;
  }
}

export async function loginAction(
  state: any,
  formData: FormData,
): Promise<{
  ok?: boolean;
  error?: string;
}> {
  const password = formData.get("password") as string;
  if (password === null || password === "") {
    return { ok: false, error: "비밀번호를 입력해 주세요" };
  }

  try {
    const res = await login(password);
    console.log(res);
    const cookieStore = await cookies();
    cookieStore.set("access_token", res.accessToken);
    cookieStore.set("refresh_token", res.refreshToken);
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return { ok: false, error: "로그인 실패" };
  }
  redirect("/");
}

export async function setCookieAction(
  accessToken: string,
  refreshToken: string,
) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
    });
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
    });
  } catch (error) {
    console.log(error);
  }
}
export async function logout() {
  try {
    (await cookies()).delete("refresh_token");
    (await cookies()).delete("access_token");
  } catch (error) {
    console.log(error);
  }
  redirect("/");
}
