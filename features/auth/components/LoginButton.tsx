"use client";

import { useModalStore } from "@/features/modal/provider";

export default function LoginButton() {
  const open = useModalStore((s) => s.open);

  return (
    <button
      className="flex cursor-pointer flex-row items-end text-end text-zinc-500"
      onClick={() => open("login")}
    >
      로그인
    </button>
  );
}
