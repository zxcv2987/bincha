"use server";

import FetchClient from "./fetchClient";

export async function login(password: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    return await FetchClient("/api/login", {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    throw new Error(`로그인 실패: ${error}`);
  }
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
}> {
  try {
    return await FetchClient("/api/login/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    console.error("토큰 갱신 중 오류 발생:", error);
    throw new Error(`토큰 갱신 실패: ${error}`);
  }
}
