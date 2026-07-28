"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUserId } from "@/lib/auth/session";
import {
  createTaskResult,
  deleteTaskResult,
  updateTaskResult,
} from "./result.service";
import {
  CompletedTodoRequiredError,
  ResultAlreadyExistsError,
  ResultNotFoundError,
} from "./result.errors";
import { ActionResult } from "@/features/shared/hooks/useAsyncAction";

export type ResultInput = {
  summary: string;
  changeSummary: string;
  unexpected: string;
  nextAction: string;
  evidenceUrl: string;
  needsMeasurement: boolean;
};

function parseResultInput(
  input: ResultInput,
): { ok: true; value: ResultInput } | { ok: false; error: string } {
  const summary = input.summary.trim();
  if (!summary) return { ok: false, error: "실제로 한 일을 입력해 주세요." };

  const evidenceUrl = input.evidenceUrl.trim();
  if (evidenceUrl) {
    try {
      new URL(evidenceUrl);
    } catch {
      return { ok: false, error: "관련 링크를 올바른 URL로 입력해 주세요." };
    }
  }

  return {
    ok: true,
    value: {
      summary,
      changeSummary: input.changeSummary.trim(),
      unexpected: input.unexpected.trim(),
      nextAction: input.nextAction.trim(),
      evidenceUrl,
      needsMeasurement: input.needsMeasurement,
    },
  };
}

function revalidateResultPaths() {
  revalidatePath("/");
  revalidatePath("/results");
}

export async function createTaskResultAction(
  todoId: number,
  input: ResultInput,
): Promise<ActionResult> {
  const parsed = parseResultInput(input);
  if (!parsed.ok) return parsed;

  try {
    const userId = await requireCurrentUserId();
    await createTaskResult({ todoId, userId, ...parsed.value });
    revalidateResultPaths();
    return { ok: true };
  } catch (error) {
    if (error instanceof CompletedTodoRequiredError) {
      return { ok: false, error: "완료한 작업에만 결과를 기록할 수 있습니다." };
    }
    if (error instanceof ResultAlreadyExistsError) {
      return { ok: false, error: "이미 결과가 기록된 할 일입니다." };
    }
    console.error("결과 생성 중 오류 발생:", error);
    return { ok: false, error: "결과를 저장하지 못했습니다." };
  }
}

export async function updateTaskResultAction(
  resultId: number,
  input: ResultInput,
): Promise<ActionResult> {
  const parsed = parseResultInput(input);
  if (!parsed.ok) return parsed;

  try {
    const userId = await requireCurrentUserId();
    await updateTaskResult({ resultId, userId, ...parsed.value });
    revalidateResultPaths();
    return { ok: true };
  } catch (error) {
    if (error instanceof ResultNotFoundError) {
      return { ok: false, error: "결과를 찾을 수 없습니다." };
    }
    console.error("결과 수정 중 오류 발생:", error);
    return { ok: false, error: "결과를 저장하지 못했습니다." };
  }
}

export async function deleteTaskResultAction(
  resultId: number,
): Promise<ActionResult> {
  try {
    const userId = await requireCurrentUserId();
    await deleteTaskResult(resultId, userId);
    revalidateResultPaths();
    return { ok: true };
  } catch (error) {
    console.error("결과 삭제 중 오류 발생:", error);
    return { ok: false, error: "결과를 삭제하지 못했습니다." };
  }
}
