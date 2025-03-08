import clsx from "clsx";

export default function Button({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={clsx(
        "w-full rounded-lg p-3 text-sm whitespace-nowrap text-zinc-600 hover:bg-zinc-100",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
