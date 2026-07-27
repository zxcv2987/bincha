import { cookies } from "next/headers";

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
