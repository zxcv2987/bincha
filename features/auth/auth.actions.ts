"use server";

import { redirect } from "next/navigation";
import { changePassword } from "@/lib/auth/password";
import { revokeRefreshToken } from "@/lib/auth/refresh";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { AuthError } from "@/lib/auth/errors";
import { getCurrentUserId } from "@/lib/auth/session";

export async function changePasswordAction(
  _state: unknown,
  formData: FormData,
): Promise<{
  ok: boolean;
  error?: string;
  message?: string;
}> {
  const userId = await getCurrentUserId();
  if (!userId) {
    return { ok: false, error: "로그인이 필요합니다" };
  }

  const password = formData.get("password") as string;
  if (!password) {
    return { ok: false, error: "비밀번호를 입력해 주세요" };
  }

  try {
    await changePassword(userId, password);
    return { ok: true, message: "비밀번호 변경 성공" };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: error.message };
    }
    console.error("비밀번호 변경 중 오류 발생:", error);
    return { ok: false, error: "비밀번호 변경 실패" };
  }
}

export async function logoutAction() {
  try {
    const userId = await getCurrentUserId();
    if (userId) {
      await revokeRefreshToken(userId);
    }
    await clearAuthCookies();
  } catch (error) {
    console.error(error);
  }

  redirect("/");
}
