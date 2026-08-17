"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-2 py-16 text-center">
      <p className="text-sm font-medium text-red-400">
        문제가 발생했습니다.
      </p>
      <p className="text-xs text-zinc-400">잠시 후 다시 시도해 주세요.</p>
      <button
        onClick={() => reset()}
        className="mt-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200"
      >
        다시 시도
      </button>
    </div>
  );
}
