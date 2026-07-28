import type { TodoType } from "@/features/todo/types";

export interface TaskResultType {
  id: number;
  created_at: Date;
  updated_at: Date;
  todo_id: number;
  user_id: number;
  summary: string;
  change_summary: string;
  unexpected: string;
  next_action: string;
  evidence_url: string;
  needs_measurement: boolean;
}

export type ResultWithTodo = TaskResultType & { todo: TodoType };
