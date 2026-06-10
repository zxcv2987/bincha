export type LoginWithPasswordResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginWithPassword(
  password: string,
): Promise<LoginWithPasswordResult> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    });

    if (!res.ok) {
      return { ok: false, error: "로그인 실패" };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "로그인 실패" };
  }
}
