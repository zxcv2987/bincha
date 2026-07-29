import { ResultWithTodo } from "@/features/result/result.types";
import ResultModalButton from "@/features/result/components/ResultModalButton";

export default function CompletedResultCard({
  result,
}: {
  result: ResultWithTodo;
}) {
  return (
    <article className="rounded-xl bg-zinc-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-zinc-700">{result.summary}</h3>
          <p className="text-sm text-zinc-500">
            연결된 할 일: {result.todo.title}
          </p>
        </div>
        <ResultModalButton todo={result.todo} />
      </div>
    </article>
  );
}
