import { ActionResult } from "@/features/shared/hooks/useAsyncAction";
import { DomainError } from "./DomainError";

export function toActionResult<T = undefined>(
  error: unknown,
  fallbackMessage: string,
  logLabel: string,
): ActionResult<T> {
  if (error instanceof DomainError) return { ok: false, error: error.message };
  console.error(logLabel, error);
  return { ok: false, error: fallbackMessage };
}
