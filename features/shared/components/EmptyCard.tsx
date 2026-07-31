export default function EmptyCard({ message }: { message: string }) {
  return (
    <div className="flex h-auto w-full items-start rounded-xl bg-zinc-50 p-4">
      <p className="w-full text-base text-zinc-500">{message}</p>
    </div>
  );
}
