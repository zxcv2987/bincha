export default function ListFetchError({ message }: { message: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-2 py-16 text-center">
      <p className="text-sm font-medium text-red-400">{message}</p>
      <p className="text-xs text-zinc-400">페이지를 새로고침해 주세요.</p>
    </div>
  );
}
