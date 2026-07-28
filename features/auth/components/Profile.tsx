"use client";

import useLogout from "@/features/auth/hooks/useLogout";

export default function Profile({ children }: { children: React.ReactNode }) {
  const { submit, pending } = useLogout();

  return (
    <button
      type="button"
      aria-label="로그아웃"
      className="cursor-pointer"
      disabled={pending}
      onClick={() => {
        if (confirm("로그아웃 하시겠습니까?")) submit();
      }}
    >
      {children}
    </button>
  );
}
