"use server";

import { headers } from "next/headers";

export default async function FetchClient(url: string, init: RequestInit) {
  const host = (await headers()).get("host");
  const protocol = (await headers()).get("x-forwarded-proto");

  const baseURL =
    process.env.NODE_ENV && process.env.NODE_ENV === "development"
      ? `http://localhost:3000/${url}`
      : `${protocol}://${host}/${url}`;

  return (await fetch(baseURL, init)).json();
}
