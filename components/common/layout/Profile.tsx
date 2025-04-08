"use client";

import { logout } from "@/actions/auth";

export default function Profile({ children }: { children: React.ReactNode }) {
  return (
    <div className="cursor-pointer" onClick={() => logout()}>
      {children}
    </div>
  );
}
