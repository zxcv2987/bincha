"use client";

import { useModalStore } from "@/utils/providers/ModalProvider";
import Modal from "../common/modal/Modal";

export default function LoginButton() {
  const open = useModalStore((set) => set.open);
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
        <form
          className="flex w-xs flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="password"
            className="input border-zinc-300 outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-zinc-100 p-2 text-sm font-semibold text-zinc-500"
          >
            로그인
          </button>
        </form>
      </Modal>
    </>
  );
}
