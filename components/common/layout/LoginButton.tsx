"use client";

import { useModalStore } from "@/utils/providers/ModalProvider";
import Modal from "../modal/Modal";
import { useActionState, useEffect } from "react";
import { loginAction, setCookieAction } from "@/actions/auth";
export default function LoginButton() {
  const open = useModalStore((set) => set.open);
  const close = useModalStore((set) => set.close);
  const [state, formAction] = useActionState(loginAction, {
    ok: false,
    error: undefined,
    token: undefined,
  });

  useEffect(() => {
    if (state.ok) {
      close();
      setCookieAction(state.token);
    }
  }, [state.ok]);
  return (
    <>
      <button
        className="flex cursor-pointer flex-row items-end text-end text-zinc-500"
        onClick={() => open("login")}
      >
        로그인
      </button>
      <Modal modalType="login">
        <Modal.Title>Login</Modal.Title>
        <form className="flex w-xs flex-col gap-4" action={formAction}>
          <input
            type="password"
            name="password"
            className="input border-zinc-300 outline-none"
          />
          {state.error && (
            <span className="text-xs text-red-400">{state.error}</span>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-100 p-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-200"
          >
            로그인
          </button>
        </form>
      </Modal>
    </>
  );
}
