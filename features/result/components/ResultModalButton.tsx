"use client";

import { useState } from "react";
import Dialog from "@/features/shared/components/Dialog";
import ResultForm from "@/features/result/components/ResultForm";
import useCreateResult from "@/features/result/hooks/useCreateResult";
import useUpdateResult from "@/features/result/hooks/useUpdateResult";
import { ResultInput } from "@/features/result/result.actions";
import { TodoType } from "@/features/todo/types";

export default function ResultModalButton({ todo }: { todo: TodoType }) {
  const [open, setOpen] = useState(false);
  const hasResult = Boolean(todo.result);
  const onSuccess = () => setOpen(false);

  // hasResult는 같은 컴포넌트가 마운트된 채로(결과를 처음 기록한 직후)
  // false→true로 바뀔 수 있어서, 어떤 훅을 부를지 조건부로 고르면 안 된다
  // (Rules of Hooks 위반). 둘 다 항상 부르고 실제로 쓸 것만 고른다.
  const createResult = useCreateResult(onSuccess);
  const updateResult = useUpdateResult(onSuccess);
  const { pending, error } = hasResult ? updateResult : createResult;

  const onSubmit = (input: ResultInput) => {
    if (hasResult) updateResult.submit(todo.result!.id, input);
    else createResult.submit(todo.id, input);
  };

  return (
    <>
      <button
        type="button"
        className="btn w-auto text-sm"
        onClick={() => setOpen(true)}
      >
        {hasResult ? "결과 보기" : "결과 기록"}
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={hasResult ? "실행 결과 보기" : "실행 결과 기록"}
      >
        <ResultForm
          todo={todo}
          error={error}
          pending={pending}
          onSubmit={onSubmit}
          onClose={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
