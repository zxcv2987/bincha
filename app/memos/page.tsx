import { Suspense } from "react";
import type { Metadata } from "next";
import AppHeader from "@/features/shared/components/AppHeader";
import LoginGate from "@/features/auth/components/LoginGate";
import Sidebar from "@/features/shared/components/Sidebar";
import MemoList from "@/features/memo/components/MemoList";
import ListFetchError from "@/features/shared/components/ListFetchError";
import { getMemos } from "@/features/memo/memo.service";
import { requireCurrentUserId } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "메모 · 빈차",
};

export default async function MemosPage() {
  try {
    await requireCurrentUserId();
  } catch {
    return (
      <>
        <AppHeader />
        <LoginGate />
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <div className="flex w-full flex-col gap-6 border-t border-zinc-200 pt-6 md:flex-row md:items-start">
        <Sidebar />
        <Suspense
          fallback={
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <header className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-zinc-700">메모</h2>
                <p className="text-sm text-zinc-500">불러오는 중…</p>
              </header>
            </div>
          }
        >
          <MemoListSection />
        </Suspense>
      </div>
    </>
  );
}

async function MemoListSection() {
  const userId = await requireCurrentUserId();

  let memos;
  try {
    memos = await getMemos(userId);
  } catch (error) {
    console.error("메모 목록 조회 실패:", error);
    return (
      <ListFetchError message="메모를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요." />
    );
  }

  return <MemoList memos={memos} />;
}
