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
        className="flex cursor-pointer flex-row items-end text-end text-zinc-500"
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
