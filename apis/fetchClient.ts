"use server";

import { headers } from "next/headers";

export default async function FetchClient(url: string, init: RequestInit) {
  const host = (await headers()).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const baseURL = `${protocol}://${host}${url}`;

  return (await fetch(baseURL, init)).json();
}
