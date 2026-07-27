"use client";

import { FormEvent, useState } from "react";
import clsx from "clsx";
import { loginWithPassword } from "@/features/auth/login.client";

export default function LoginFormContent({
  onLoadingChange,
}: {
  onLoadingChange: (loading: boolean) => void;
}) {
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);
    onLoadingChange(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!password) {
      setError("비밀번호를 입력해 주세요");
      setIsLoading(false);
      onLoadingChange(false);
      return;
    }

    const result = await loginWithPassword(password);

    if (!result.ok) {
      setError(result.error);
      setIsLoading(false);
      onLoadingChange(false);
      return;
    }

    // 쿠키 세팅 후 RSC를 확실히 다시 그리기 위해 soft refresh 대신 풀 리로드
    window.location.assign("/");
  }

  return (
    <form className="flex w-xs flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="password"
        name="password"
        placeholder="비밀번호"
        aria-label="비밀번호"
        autoComplete="current-password"
        autoFocus
        className="input border-zinc-300 outline-none"
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      <button
        type="submit"
        className={clsx("btn btn-primary", isLoading && "opacity-90")}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
