"use client";

import { useEffect, useRef, useState } from "react";
import MemoForm from "@/features/memo/components/MemoForm";
import useCreateMemo from "@/features/memo/hooks/useCreateMemo";

const DRAFT_KEY = "bincha:memo-draft:v1";

function readDraft(): { content: string; link: string } | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.content !== "string" || typeof parsed?.link !== "string") {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function writeDraft(values: { content: string; link: string }) {
  try {
    if (values.content.trim() || values.link.trim()) {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values));
    } else {
      sessionStorage.removeItem(DRAFT_KEY);
    }
  } catch {
    // 저장 공간을 쓸 수 없어도(시크릿 모드 등) 초안 보호는 부가 기능이므로 무시한다.
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // 위와 동일하게 무시한다.
  }
}

export default function MemoComposer() {
  const [formKey, setFormKey] = useState(0);
  const [initialDraft] = useState(readDraft);
  const [statusMessage, setStatusMessage] = useState("");
  const statusTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const { submit, pending, error, fieldErrors } = useCreateMemo(() => {
    clearDraft();
    setFormKey((key) => key + 1);
    setStatusMessage("메모를 추가했습니다.");
    clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(""), 3000);
  });

  useEffect(() => () => clearTimeout(statusTimeoutRef.current), []);

  return (
    <section aria-label="메모 빠른 추가" className="pb-2">
      <MemoForm
        key={formKey}
        variant="quick"
        onSubmit={submit}
        pending={pending}
        error={error}
        fieldErrors={fieldErrors}
        className="w-full"
        autoFocus
        initialValues={formKey === 0 ? initialDraft : undefined}
        onFieldsChange={writeDraft}
        statusMessage={statusMessage}
      />
    </section>
  );
}
