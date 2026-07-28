"use client";

import { FormEvent, useEffect } from "react";
import clsx from "clsx";
import useLogin from "@/features/auth/hooks/useLogin";

export default function LoginFormContent({
  onLoadingChange,
  className = "w-xs",
}: {
  onLoadingChange?: (loading: boolean) => void;
  className?: string;
}) {
  const { submit, pending, error } = useLogin();

  useEffect(() => {
    onLoadingChange?.(pending);
  }, [pending, onLoadingChange]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    submit(String(formData.get("password") ?? ""));
  }

  return (
    <form
      className={clsx("flex flex-col gap-4", className)}
      onSubmit={handleSubmit}
    >
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
        className={clsx("btn btn-primary", pending && "opacity-90")}
        disabled={pending}
      >
        {pending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
