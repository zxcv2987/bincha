import { TodoType } from "@/features/todo/todo.types";
import { TodoInput } from "@/features/todo/todo.actions";
import CategoryPicker from "@/features/category/components/CategoryPicker";
import { useId } from "react";
import clsx from "clsx";
import ButtonLabel from "@/features/shared/components/ButtonLabel";

export default function TodoForm({
  todo,
  pending,
  fieldErrors,
  onSubmit,
  onCancel,
  compact = false,
  className = "w-xs md:w-md",
  textRows = 5,
}: {
  todo?: TodoType;
  pending: boolean;
  fieldErrors?: Record<string, string>;
  onSubmit: (input: TodoInput) => void;
  onCancel?: () => void;
  compact?: boolean;
  className?: string;
  textRows?: number;
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
      className={clsx("flex flex-col gap-5", className)}
    >
      <div className="flex flex-col gap-1.5">
        {!compact && (
          <label htmlFor={titleId} className="text-sm font-semibold text-zinc-600">
            할 일
          </label>
        )}
        <input
          id={titleId}
          name="title"
          placeholder="할 일"
          className={clsx(
            "input",
            compact && "px-2.5 py-1.5 text-sm font-semibold text-zinc-700",
          )}
          defaultValue={todo && todo.title}
          spellCheck={false}
        />
        {fieldErrors?.title && (
          <span className="text-xs text-red-400">{fieldErrors.title}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {!compact && (
          <label htmlFor={textId} className="text-sm font-semibold text-zinc-600">
            내용
          </label>
        )}
        <textarea
          id={textId}
          name="text"
          placeholder="내용"
          rows={textRows}
          className={clsx(
            "input",
            compact &&
              "field-sizing-content max-h-52 overflow-y-auto px-2.5 py-1.5 text-sm text-zinc-500",
          )}
          defaultValue={todo && todo.text}
          spellCheck={false}
        />
      </div>

      <CategoryPicker
        defaultCategoryId={todo?.category_id}
        error={fieldErrors?.categoryId}
      />

      <div className="flex gap-2">
        <button
          className={clsx(
            "btn btn-primary",
            onCancel && "w-auto",
            compact && "px-6 py-3 text-sm",
          )}
          disabled={pending}
          type="submit"
        >
          <ButtonLabel pending={pending} pendingText="로딩 중...">
            {todo ? "할 일 수정" : "할 일 추가"}
          </ButtonLabel>
        </button>
        {onCancel && (
          <button
            type="button"
            className={clsx("btn w-auto", compact && "px-6 py-3 text-sm")}
            disabled={pending}
            onClick={onCancel}
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
