import { unstable_cache } from "next/cache";
import { getCategories } from "./category.service";

export const getCachedCategories = unstable_cache(
  getCategories,
  ["categories"],
  { tags: ["category"] },
);
