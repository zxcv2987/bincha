"use server";

import { revalidatePath } from "next/cache";
import { createMemo, deleteMemo, updateMemo } from "./memo.service";
import { requireCurrentUserId } from "@/lib/auth/session";
import { ActionResult } from "@/features/shared/hooks/useAsyncAction";

export type MemoInput = {
  content: string;
  link: string;
};

function normalizeMemoInput(input: MemoInput): MemoInput {
  return {
    content: input.content.trim(),
    link: input.link.trim(),
  };
}

function validateMemoInput(input: MemoInput) {
  const fieldErrors: Record<string, string> = {};

  if (!input.content) fieldErrors.content = "메모 내용을 입력해 주세요.";

  if (input.link) {
    try {
      const url = new URL(input.link);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        fieldErrors.link = "http 또는 https 링크를 입력해 주세요.";
      }
    } catch {
      fieldErrors.link = "올바른 링크를 입력해 주세요.";
    }
  }

  return fieldErrors;
}

export async function createMemoAction(
  input: MemoInput,
): Promise<ActionResult> {
  const normalized = normalizeMemoInput(input);
  const fieldErrors = validateMemoInput(normalized);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  try {
    const userId = await requireCurrentUserId();
    await createMemo(normalized.content, normalized.link, userId);
    revalidatePath("/memos");
    return { ok: true };
  } catch (error) {
    console.error("메모 추가 중 오류 발생:", error);
    return { ok: false, error: "메모를 추가하지 못했습니다." };
  }
}

export async function updateMemoAction(
  id: number,
  input: MemoInput,
): Promise<ActionResult> {
  const normalized = normalizeMemoInput(input);
  const fieldErrors = validateMemoInput(normalized);
  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  try {
    const userId = await requireCurrentUserId();
    await updateMemo({ id, ...normalized, userId });
    revalidatePath("/memos");
    return { ok: true };
  } catch (error) {
    console.error("메모 수정 중 오류 발생:", error);
    return { ok: false, error: "메모를 수정하지 못했습니다." };
  }
}

export async function deleteMemoAction(memoId: number): Promise<ActionResult> {
  try {
    const userId = await requireCurrentUserId();
    await deleteMemo(memoId, userId);
    revalidatePath("/memos");
    return { ok: true };
  } catch (error) {
    console.error("메모 삭제 중 오류 발생:", error);
    return { ok: false, error: "삭제 실패" };
  }
}
