"use server";

export default async function FetchClient(url: string, init: RequestInit) {
  const baseURL =
    process.env.NODE_ENV && process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${url}`
      : process.env.NEXT_PUBLIC_BASE_URL + url;

  return (await fetch(baseURL, init)).json();
}
