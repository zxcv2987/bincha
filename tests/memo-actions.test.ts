import { describe, expect, test } from "vitest";
import { createMemoAction } from "@/features/memo/memo.actions";

describe("메모 입력 검증", () => {
  test("공백으로만 된 메모 내용을 거부한다", async () => {
    const result = await createMemoAction({ content: "   ", link: "" });

    expect(result).toEqual({
      ok: false,
      fieldErrors: { content: "메모 내용을 입력해 주세요." },
    });
  });

  test("올바르지 않은 링크를 거부한다", async () => {
    const result = await createMemoAction({
      content: "검증할 메모",
      link: "not-a-url",
    });

    expect(result).toEqual({
      ok: false,
      fieldErrors: { link: "올바른 링크를 입력해 주세요." },
    });
  });

  test("http와 https가 아닌 링크 프로토콜을 거부한다", async () => {
    const result = await createMemoAction({
      content: "검증할 메모",
      link: "javascript:alert(1)",
    });

    expect(result).toEqual({
      ok: false,
      fieldErrors: { link: "http 또는 https 링크를 입력해 주세요." },
    });
  });
});
