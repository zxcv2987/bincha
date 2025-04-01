import { useModalStore } from "@/utils/providers/ModalProvider";

export default function ModalTitle({
  children,
}: {
  children: React.ReactNode;
}) {
  const { close } = useModalStore((set) => set);
  return (
    <div className="flex w-full flex-row items-center justify-between py-2">
      <h1 className="text-2xl font-bold text-zinc-700">{children}</h1>
      <button
        onClick={close}
        className="cursor-pointer px-1 text-sm font-thin text-zinc-700"
      >
        ✖
      </button>
    </div>
  );
}
