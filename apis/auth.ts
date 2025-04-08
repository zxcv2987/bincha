"use server";

import FetchClient from "./fetchClient";

export async function login(password: string) {
  return await FetchClient("/api/login", {
    method: "POST",
    body: JSON.stringify({
      password,
    }),
  });
}
