import { useModalStore } from "@/utils/providers/ModalProvider";

export default function Modal({
  children,
  modalType,
}: {
  children: React.ReactNode;
  modalType: string;
}) {
  const { openModal, isOpen, close } = useModalStore((set) => set);
  return (
    <>
      {isOpen && openModal === modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={close}
            className="absolute inset-0 flex items-center justify-center bg-zinc-700 opacity-10"
          ></div>
          <div className="relative h-auto rounded-xl bg-white p-4">
            {children}
          </div>
        </div>
      )}
    </>
  );
}
