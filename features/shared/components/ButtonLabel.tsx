import Spinner from "@/features/shared/components/Spinner";

export default function ButtonLabel({
  pending,
  pendingText,
  children,
}: {
  pending: boolean;
  pendingText: string;
  children: React.ReactNode;
}) {
  if (!pending) return <>{children}</>;

  return (
    <span className="inline-flex items-center justify-center gap-1.5">
      <Spinner />
      {pendingText}
    </span>
  );
}
