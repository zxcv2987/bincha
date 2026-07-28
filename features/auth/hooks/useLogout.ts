"use client";

import { useState } from "react";
import { logoutAction } from "@/features/auth/auth.actions";

export default function useLogout() {
  const [pending, setPending] = useState(false);

  const submit = async () => {
    setPending(true);
    await logoutAction();
  };

  return { submit, pending };
}
