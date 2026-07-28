import { CategoryType } from "@/features/category/category.types";
import type { TaskResultType } from "@/features/result/result.types";

export interface TodoType {
  id: number;
  created_at: Date;
  text: string;
  category_id: number;
  title: string;
  completed: boolean;
  completed_at: Date | null;
  category: CategoryType;
  result?: TaskResultType | null;
}
