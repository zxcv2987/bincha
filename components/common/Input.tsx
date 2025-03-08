export default function TextArea({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="flex w-full flex-wrap rounded-lg border border-zinc-300 p-2 break-words whitespace-pre-wrap outline-none focus:border-zinc-400"
      {...props}
    />
  );
}
