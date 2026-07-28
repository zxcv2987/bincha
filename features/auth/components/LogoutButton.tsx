"use client";

import useLogout from "@/features/auth/hooks/useLogout";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function LogoutButton() {
  const { submit, pending } = useLogout();

  return (
    <button
      type="button"
      className="focus-visible:ring-brand-500 inline-flex h-10 cursor-pointer items-center rounded-lg px-3 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={pending}
      onClick={() => {
        if (confirm("로그아웃 하시겠습니까?")) submit();
      }}
    >
      <ButtonLabel pending={pending} pendingText="로그아웃 중...">
        로그아웃
      </ButtonLabel>
    </button>
  );
}
