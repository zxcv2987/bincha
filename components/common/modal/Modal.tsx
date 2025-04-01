import { useModalStore } from "@/utils/providers/ModalProvider";
import ModalTitle from "./ModalTitle";
import { createPortal } from "react-dom";
import React from "react";

function Modal({
  children,
  modalType,
}: {
  children: React.ReactNode;
  modalType: string;
}) {
  const isOpen = useModalStore((state) => state.isOpen);
  const openModal = useModalStore((state) => state.openModal);
  const close = useModalStore((state) => state.close);

  if (!isOpen || openModal !== modalType) return null;

  const portalRoot = document.getElementById("portal-root");
  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={close}
        className="absolute inset-0 bg-zinc-700 opacity-10"
      ></div>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative h-auto rounded-xl bg-white p-4"
      >
        {children}
      </div>
    </div>,
    portalRoot,
  );
}

export default Object.assign(Modal, { Title: ModalTitle });
