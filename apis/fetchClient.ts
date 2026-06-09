import { cookies } from "next/headers";

export default async function FetchClient(url: string, init: RequestInit) {
  const baseURL =
    process.env.NODE_ENV && process.env.NODE_ENV === "development"
      ? `http://localhost:3000${url}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

  const accessToken = (await cookies()).get("access_token")?.value;

  const headers: Record<string, string> = {
    ...(init.headers as Record<string, string>),
  };

  if (init.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(baseURL, {
    ...init,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}
