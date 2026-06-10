import { unstable_cache } from "next/cache";
import { getCategories } from "@/lib/services/category";

export const getCachedCategories = unstable_cache(
  getCategories,
  ["categories"],
  { tags: ["category"] },
);
