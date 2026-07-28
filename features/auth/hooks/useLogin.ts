"use client";

import { useState } from "react";

export default function useLogin() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (password: string) => {
    if (!password) {
      setError("비밀번호를 입력해 주세요");
      return;
    }
    setPending(true);
    setError(undefined);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError("로그인 실패");
        setPending(false);
        return;
      }

      // 쿠키 세팅 후 RSC를 확실히 다시 그리기 위해 soft refresh 대신 풀 리로드
      window.location.assign("/");
    } catch {
      setError("로그인 실패");
      setPending(false);
    }
  };

  return { submit, pending, error };
}
