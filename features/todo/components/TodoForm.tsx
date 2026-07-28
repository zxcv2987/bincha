import { TodoType } from "@/features/todo/todo.types";
import { TodoInput } from "@/features/todo/todo.actions";
import CategoryPicker from "@/features/category/components/CategoryPicker";
import { useId } from "react";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function TodoForm({
  todo,
  pending,
  fieldErrors,
  onSubmit,
}: {
  todo?: TodoType;
  pending: boolean;
  fieldErrors?: Record<string, string>;
  onSubmit: (input: TodoInput) => void;
}) {
  const titleId = useId();
  const textId = useId();

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const categoryId = formData.get("category");

        onSubmit({
          title: String(formData.get("title") ?? ""),
          text: String(formData.get("text") ?? ""),
          categoryId: typeof categoryId === "string" ? categoryId : null,
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
        {fieldErrors?.title && (
          <span className="text-xs text-red-400">{fieldErrors.title}</span>
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
      </div>

      <CategoryPicker
        defaultCategoryId={todo?.category_id}
        error={fieldErrors?.categoryId}
      />

      <button className="btn btn-primary" disabled={pending} type="submit">
        <ButtonLabel pending={pending} pendingText="로딩 중...">
          {todo ? "할 일 수정" : "할 일 추가"}
        </ButtonLabel>
      </button>
    </form>
  );
}
