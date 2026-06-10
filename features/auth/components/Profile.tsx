"use client";

import { logout } from "@/features/auth/actions";

export default function Profile({ children }: { children: React.ReactNode }) {
  return (
    <div className="cursor-pointer" onClick={() => logout()}>
      {children}
    </div>
  );
}
