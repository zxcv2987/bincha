"use client";

import { useModalStore } from "@/features/modal/provider";

export default function CreateCategoryButton() {
  const open = useModalStore((s) => s.open);

  return (
    <button
      className="btn max-h-[50px] w-full md:max-w-[200px]"
      onClick={() => open("category")}
    >
      카테고리 추가 +
    </button>
  );
}
