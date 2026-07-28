import { TodoType } from "@/features/todo/types";
import CategoryPicker from "@/features/category/components/CategoryPicker";
import { useId, useTransition } from "react";

type TodoFormState = {
  ok: boolean;
  error?: {
    id?: string;
    title?: string;
    text?: string;
    categoryId?: string;
  };
};

export default function TodoForm({
  state,
  formAction,
  todo,
}: {
  state: TodoFormState;
  formAction: (formData: FormData) => void;
  todo?: TodoType;
}) {
  const [isPending, startTransition] = useTransition();
  const titleId = useId();
  const textId = useId();

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        startTransition(() => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          if (todo) {
            formData.append("id", todo.id.toString());
          }

          formAction(formData);
        });
      }}
      className="flex w-xs flex-col gap-5 md:w-md"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor={titleId} className="text-sm font-semibold text-zinc-600">
          할 일
        </label>
        <input
          id={titleId}
          name="title"
          placeholder="할 일"
          className="input"
          defaultValue={todo && todo.title}
          spellCheck={false}
        />
        {state.error?.title && (
          <span className="text-xs text-red-400">{state.error.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={textId} className="text-sm font-semibold text-zinc-600">
          내용
        </label>
        <textarea
          id={textId}
          name="text"
          placeholder="내용"
          rows={5}
          className="input"
          defaultValue={todo && todo.text}
          spellCheck={false}
        />
        {state.error?.text && (
          <span className="text-xs text-red-400">{state.error.text}</span>
        )}
      </div>

      <CategoryPicker
        defaultCategoryId={todo?.category_id}
        error={state.error?.categoryId}
      />

      <button className="btn btn-primary" disabled={isPending} type="submit">
        {isPending ? "로딩 중" : todo ? "할 일 수정" : "할 일 추가"}
      </button>
    </form>
  );
}
