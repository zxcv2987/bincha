import { CategoryType } from "@/features/category/types";

export interface TodoType {
  id: number;
  created_at: Date;
  text: string;
  category_id: number;
  title: string;
  category: CategoryType;
}
