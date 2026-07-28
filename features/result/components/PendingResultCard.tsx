import { TodoType } from "@/features/todo/todo.types";
import ResultModalButton from "@/features/result/components/ResultModalButton";

export default function PendingResultCard({ todo }: { todo: TodoType }) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-xl bg-zinc-50 p-4">
      <div>
        <h3 className="font-semibold text-zinc-700">{todo.title}</h3>
        {todo.completed_at && (
          <p className="text-sm text-zinc-400">
            완료일: {new Date(todo.completed_at).toLocaleDateString("ko-KR")}
          </p>
        )}
      </div>
      <ResultModalButton todo={todo} />
    </article>
  );
}
