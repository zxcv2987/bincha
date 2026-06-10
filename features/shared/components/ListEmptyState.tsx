import clsx from "clsx";

export default function ListEmptyState({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <p
      className={clsx(
        "py-8 text-center text-sm text-zinc-400",
        className,
      )}
    >
      {message}
    </p>
  );
}
