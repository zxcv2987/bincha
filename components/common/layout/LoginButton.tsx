"use client";

import { useModalStore } from "@/utils/providers/ModalProvider";
import Modal from "../modal/Modal";
import { useActionState, useEffect } from "react";
import { loginAction } from "@/actions/auth";
import clsx from "clsx";
export default function LoginButton() {
  const open = useModalStore((set) => set.open);
  const close = useModalStore((set) => set.close);
  const [state, formAction, isLoading] = useActionState(loginAction, {
    ok: false,
    error: undefined,
  });

  useEffect(() => {
    if (state.ok) {
      close();
    }
  }, [state.ok, close]);
  return (
    <>
      <button
        className="flex cursor-pointer flex-row items-end text-end text-zinc-500"
        onClick={() => open("login")}
      >
        로그인
      </button>
      <Modal modalType="login" isLoading={isLoading}>
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
            className={clsx(
              "w-full rounded-lg bg-zinc-100 p-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-200",
              isLoading && "bg-zinc-200",
            )}
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </Modal>
    </>
  );
}
