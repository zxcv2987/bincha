import { cookies } from "next/headers";
import { authCookieOptions } from "./cookie-options";

export { authCookieOptions };

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", accessToken, authCookieOptions);
  cookieStore.set("refresh_token", refreshToken, authCookieOptions);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
