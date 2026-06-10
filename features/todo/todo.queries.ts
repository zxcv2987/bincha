import { unstable_cache } from "next/cache";
import { getTodos } from "./todo.service";

export const getCachedTodos = unstable_cache(getTodos, ["todos"], {
  tags: ["todos"],
});
