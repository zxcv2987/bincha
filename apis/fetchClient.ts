"use server";

import { cookies } from "next/headers";

export default async function FetchClient(url: string, init: RequestInit) {
  const baseURL =
    process.env.NODE_ENV && process.env.NODE_ENV === "development"
      ? `http://localhost:3000${url}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

  const accessToken = (await cookies()).get("access_token")?.value;

  init = {
    ...init,
    headers: {
      ...init.headers,
      Authorization: accessToken ? `Bearer ${accessToken}` : "",
    },
  };
  const response = await fetch(baseURL, init);

  // 응답 상태 확인
  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
