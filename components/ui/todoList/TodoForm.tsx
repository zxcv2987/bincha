import { TodoType } from "@/types/todos";
import { useCategoryStore } from "@/utils/providers/CategoryProvider";

export default function TodoForm({
  state,
  todo,
}: {
  // eslint-disable-next-line
  state: any;
  todo?: TodoType;
}) {
  const categories = useCategoryStore((set) => set.categories);
  return (
    <>
      <h3 className="text-xl font-semibold text-zinc-600">할 일</h3>
      <input
        name="title"
        placeholder="할 일"
        className="input"
        defaultValue={todo && todo.title}
      />
      {state.error?.title && (
        <span className="text-xs text-red-400">{state.error.title}</span>
      )}
      <h3 className="text-xl font-semibold text-zinc-600">내용</h3>
      <textarea
        name="text"
        placeholder="내용"
        rows={5}
        className="input"
        defaultValue={todo && todo.text}
      />
      {state.error?.text && (
        <span className="text-xs text-red-400">{state.error.text}</span>
      )}
      <h3 className="text-xl font-semibold text-zinc-600">카테고리</h3>
      <ul className="flex flex-row flex-wrap gap-2">
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
    </>
  );
}
