"use server";

export default async function FetchClient(url: string, init: RequestInit) {
  try {
    const baseURL =
      process.env.NODE_ENV && process.env.NODE_ENV === "development"
        ? `http://localhost:3000/${url}`
        : process.env.NEXT_PUBLIC_BASE_URL + url;

    const response = await fetch(baseURL, init);
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(`FetchClient 오류 (${url}):`, error);
    throw new Error(`API 요청 실패`);
  }
}
