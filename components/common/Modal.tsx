export default function Modal({
  children,
  closeFn,
}: {
  children: React.ReactNode;
  closeFn?: Function;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => closeFn && closeFn()}
        className="absolute inset-0 flex items-center justify-center bg-zinc-700 opacity-10"
      ></div>
      <div className="relative h-auto rounded-xl bg-white p-4">{children}</div>
    </div>
  );
}
