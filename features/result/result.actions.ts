"use server";

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

function parseResultForm(formData: FormData) {
  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) {
    return { ok: false as const, error: "실제로 한 일을 입력해 주세요." };
  }

  const evidenceUrl = String(formData.get("evidenceUrl") ?? "").trim();
  if (evidenceUrl) {
    try {
      new URL(evidenceUrl);
    } catch {
      return {
        ok: false as const,
        error: "관련 링크를 올바른 URL로 입력해 주세요.",
      };
    }
  }

  return {
    ok: true as const,
    input: {
      summary,
      changeSummary: String(formData.get("changeSummary") ?? "").trim(),
      unexpected: String(formData.get("unexpected") ?? "").trim(),
      nextAction: String(formData.get("nextAction") ?? "").trim(),
      evidenceUrl,
      needsMeasurement: formData.get("needsMeasurement") === "on",
    },
  };
}

export async function createTaskResultAction(
  _state: unknown,
  formData: FormData,
) {
  const todoId = Number(formData.get("todoId"));
  if (!Number.isSafeInteger(todoId)) {
    return { ok: false, error: "할 일이 잘못되었습니다." };
  }
  const parsed = parseResultForm(formData);
  if (!parsed.ok) return parsed;

  try {
    const userId = await requireCurrentUserId();
    await createTaskResult({ todoId, userId, ...parsed.input });
    return { ok: true };
  } catch (error) {
    if (error instanceof CompletedTodoRequiredError) {
      return {
        ok: false,
        error: "완료한 작업에만 결과를 기록할 수 있습니다.",
      };
    }
    if (error instanceof ResultAlreadyExistsError) {
      return { ok: false, error: "이미 결과가 기록된 할 일입니다." };
    }
    console.error("결과 생성 중 오류 발생:", error);
    return { ok: false, error: "결과를 저장하지 못했습니다." };
  }
}

export async function updateTaskResultAction(
  _state: unknown,
  formData: FormData,
) {
  const resultId = Number(formData.get("resultId"));
  if (!Number.isSafeInteger(resultId)) {
    return { ok: false, error: "결과가 잘못되었습니다." };
  }
  const parsed = parseResultForm(formData);
  if (!parsed.ok) return parsed;

  try {
    const userId = await requireCurrentUserId();
    await updateTaskResult({ resultId, userId, ...parsed.input });
    return { ok: true };
  } catch (error) {
    if (error instanceof ResultNotFoundError) {
      return { ok: false, error: "결과를 찾을 수 없습니다." };
    }
    console.error("결과 수정 중 오류 발생:", error);
    return { ok: false, error: "결과를 저장하지 못했습니다." };
  }
}

export async function deleteTaskResultAction(resultId: number) {
  try {
    const userId = await requireCurrentUserId();
    await deleteTaskResult(resultId, userId);
    return { ok: true };
  } catch (error) {
    console.error("결과 삭제 중 오류 발생:", error);
    return { ok: false, error: "결과를 삭제하지 못했습니다." };
  }
}
