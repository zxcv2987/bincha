"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import LoginFormContent from "@/features/auth/components/LoginFormContent";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex h-10 cursor-pointer items-end rounded-lg px-3 text-sm font-semibold text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        onClick={() => setOpen(true)}
      >
        로그인
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="로그인"
        disableBackdropClose={loading}
      >
        <LoginFormContent onLoadingChange={setLoading} />
      </Dialog>
    </>
  );
}
