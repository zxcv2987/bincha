import { TodoType } from "@/features/todo/types";
import { useCategoryStore } from "@/features/category/provider";
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
  const categories = useCategoryStore((set) => set.categories);
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
        />
        {state.error?.text && (
          <span className="text-xs text-red-400">{state.error.text}</span>
        )}
      </div>

      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
        <legend className="p-0 text-sm font-semibold text-zinc-600">
          카테고리
        </legend>
        <ul className="flex flex-row flex-wrap gap-2 pt-1">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name="category"
                className="peer hidden"
                value={category.id}
                defaultChecked={
                  todo && todo.category.category_name === category.category_name
                }
              />
              <span className="text-base text-zinc-400 peer-checked:font-semibold peer-checked:text-zinc-700">
                {category.category_name}
              </span>
            </label>
          ))}
        </ul>
        {state.error?.categoryId && (
          <span className="text-xs text-red-400">{state.error.categoryId}</span>
        )}
      </fieldset>

      <button className="btn btn-primary" disabled={isPending} type="submit">
        {isPending ? "로딩 중" : todo ? "할 일 수정" : "할 일 추가"}
      </button>
    </form>
  );
}
