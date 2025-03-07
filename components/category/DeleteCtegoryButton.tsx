"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/actions/category";
import clsx from "clsx";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className={clsx(
        "z-20 rounded-lg px-4 py-2 text-red-500 hover:bg-zinc-50",
        isPending ? "cursor-not-allowed opacity-50" : "",
      )}
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await deleteCategoryAction({ ok: false }, categoryId);
          if (res.ok) {
            router.refresh();
          } else {
            alert("삭제 실패");
          }
        });
      }}
    >
      {isPending ? "삭제 중..." : "카테고리 삭제"}
    </button>
  );
}
