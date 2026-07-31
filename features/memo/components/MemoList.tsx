"use client";

import { MemoType } from "@/features/memo/memo.types";
import { useState } from "react";
import MemoComposer from "@/features/memo/components/MemoComposer";
import MemoItem from "@/features/memo/components/MemoItem";
import EmptyCard from "@/features/shared/components/EmptyCard";

export default function MemoList({ memos }: { memos: MemoType[] }) {
  const [editingMemoId, setEditingMemoId] = useState<number | null>(null);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-zinc-700">메모</h2>
        <p className="text-sm text-zinc-500">
          아직 할 일이나 결과로 정리하지 않은 기억을 빠르게 남겨 두세요.
        </p>
      </header>

      <MemoComposer />

      {memos.length === 0 ? (
        <EmptyCard message="위에 적으면 바로 쌓입니다." />
      ) : (
        <div className="flex flex-col divide-y divide-zinc-100">
          {memos.map((memo) => (
            <MemoItem
              key={memo.id}
              memo={memo}
              isEditing={editingMemoId === memo.id}
              onEdit={() => setEditingMemoId(memo.id)}
              onCancelEdit={() => setEditingMemoId(null)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
