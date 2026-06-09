"use client";

import { useModalStore } from "@/utils/providers/ModalProvider";
import Modal from "../modal/Modal";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function LoginButton() {
  const router = useRouter();
  const open = useModalStore((set) => set.open);
  const close = useModalStore((set) => set.close);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!password) {
      setError("비밀번호를 입력해 주세요");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError("로그인 실패");
        setIsLoading(false);
        return;
      }

      close();
      router.refresh();
      router.push("/");
    } catch {
      setError("로그인 실패");
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className="flex cursor-pointer flex-row items-end text-end text-zinc-500"
        onClick={() => open("login")}
      >
        로그인
      </button>
      <Modal modalType="login" isLoading={isLoading}>
        <Modal.Title>Login</Modal.Title>
        <form className="flex w-xs flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="password"
            name="password"
            className="input border-zinc-300 outline-none"
          />
          {error && <span className="text-xs text-red-400">{error}</span>}
          <button
            type="submit"
            className={clsx(
              "w-full rounded-lg bg-zinc-100 p-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-200",
              isLoading && "bg-zinc-200",
            )}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </Modal>
    </>
  );
}
