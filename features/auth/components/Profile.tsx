"use client";

import { logoutAction } from "@/features/auth/auth.actions";

export default function Profile({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label="로그아웃"
      className="cursor-pointer"
      onClick={() => {
        if (confirm("로그아웃 하시겠습니까?")) logoutAction();
      }}
    >
      {children}
    </button>
  );
}
