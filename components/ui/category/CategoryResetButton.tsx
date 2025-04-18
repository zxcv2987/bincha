import clsx from "clsx";

export default function CategoryResetButton({
  categoryState,
  resetCategory,
  children,
}: {
  categoryState: string | null;
  resetCategory: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded-lg border-zinc-200 p-2 text-lg text-zinc-400 hover:text-zinc-700",
        categoryState === null && "font-semibold text-zinc-700",
      )}
      onClick={resetCategory}
    >
      {children}
    </button>
  );
}
