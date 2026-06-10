import { unstable_cache } from "next/cache";
import { getTodos } from "@/lib/services/todo";

export const getCachedTodos = unstable_cache(getTodos, ["todos"], {
  tags: ["todos"],
});
