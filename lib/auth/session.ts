import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/tokens";

export async function getCurrentUserId(): Promise<bigint | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  try {
    const payload = await verifyAccessToken(accessToken);
    return BigInt(payload.id as number);
  } catch {
    return null;
  }
}

export async function requireCurrentUserId(): Promise<bigint> {
  const userId = await getCurrentUserId();

  if (!userId) throw new Error("AUTH_REQUIRED");

  return userId;
}
