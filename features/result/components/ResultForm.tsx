"use client";

import { TodoType } from "@/features/todo/types";
import { ResultInput } from "@/features/result/result.actions";
import useDeleteResult from "@/features/result/hooks/useDeleteResult";

export default function ResultForm({
  todo,
  error,
  pending,
  onSubmit,
  onClose,
}: {
  todo: TodoType;
  error?: string;
  pending: boolean;
  onSubmit: (input: ResultInput) => void;
  onClose: () => void;
}) {
  const result = todo.result;
  const {
    submit: deleteResultSubmit,
    pending: deleting,
    error: deleteError,
  } = useDeleteResult(onClose);

  const deleteResult = () => {
    if (!result || !confirm("이 결과 기록을 삭제할까요?")) return;
    deleteResultSubmit(result.id);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      summary: String(formData.get("summary") ?? ""),
      changeSummary: String(formData.get("changeSummary") ?? ""),
      unexpected: String(formData.get("unexpected") ?? ""),
      nextAction: String(formData.get("nextAction") ?? ""),
      evidenceUrl: String(formData.get("evidenceUrl") ?? ""),
      needsMeasurement: formData.get("needsMeasurement") === "on",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-[calc(100vw-4rem)] max-w-md flex-col gap-3"
    >
      <p className="text-sm font-medium text-zinc-500">{todo.title}</p>
      <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-600">
        <span>
          실제로 무엇을 했나요?{" "}
          <span className="font-normal text-red-400">필수</span>
        </span>
        <textarea
          name="summary"
          rows={3}
          className="input font-normal"
          defaultValue={result?.summary}
          spellCheck={false}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-600">
        무엇이 달라졌나요?
        <textarea
          name="changeSummary"
          rows={2}
          className="input font-normal"
          defaultValue={result?.change_summary}
          spellCheck={false}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-600">
        예상과 달랐던 점이 있나요?
        <textarea
          name="unexpected"
          rows={2}
          className="input font-normal"
          defaultValue={result?.unexpected}
          spellCheck={false}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-600">
        다음에 이어서 할 일이 있나요?
        <textarea
          name="nextAction"
          rows={2}
          className="input font-normal"
          defaultValue={result?.next_action}
          spellCheck={false}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-zinc-600">
        관련 링크
        <input
          type="url"
          name="evidenceUrl"
          className="input font-normal"
          placeholder="https://"
          defaultValue={result?.evidence_url}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input
          type="checkbox"
          name="needsMeasurement"
          defaultChecked={result?.needs_measurement}
        />
        나중에 측정 필요
      </label>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
      <div className="flex justify-between gap-2">
        {result && (
          <button
            type="button"
            className="btn w-auto text-red-500"
            disabled={deleting || pending}
            onClick={deleteResult}
          >
            {deleting ? "삭제 중..." : "결과 삭제"}
          </button>
        )}
        <button
          type="submit"
          className="btn btn-primary ml-auto w-auto"
          disabled={pending || deleting}
        >
          {pending ? "저장 중..." : result ? "결과 수정" : "결과 저장"}
        </button>
      </div>
    </form>
  );
}
