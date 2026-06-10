"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { changePassword } from "@/lib/auth/password";
import { revokeRefreshToken } from "@/lib/auth/refresh";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/tokens";
import { AuthError } from "@/lib/auth/errors";

export async function getUserRole() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    return payload.username as string;
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return null;
  }
}

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    return BigInt(payload.id as number);
  } catch {
    return null;
  }
}

export async function changePasswordAction(
  _state: unknown,
  formData: FormData,
): Promise<{
  ok: boolean;
  error?: string;
  message?: string;
}> {
  const userId = await getAuthenticatedUserId();
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

export async function logout() {
  try {
    const userId = await getAuthenticatedUserId();
    if (userId) {
      await revokeRefreshToken(userId);
    }
    await clearAuthCookies();
  } catch (error) {
    console.error(error);
  }

  redirect("/");
}
