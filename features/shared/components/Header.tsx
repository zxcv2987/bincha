import Link from "next/link";
import LoginButton from "@/features/auth/components/LoginButton";
import Profile from "@/features/auth/components/Profile";
import { getCurrentUserId } from "@/lib/auth/session";

export default async function Header() {
  const isLoggedIn = (await getCurrentUserId()) !== null;

  return (
    <header className="flex w-full items-center justify-between gap-4 border-b border-zinc-200 py-6">
      <Link
        href="/"
        aria-label="내가 해야 할 일 홈"
        className="flex min-w-0 items-end gap-3 rounded-lg focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <h1 className="min-w-0 truncate text-2xl font-semibold text-zinc-700 sm:text-4xl">
          내가 해야 할 일
        </h1>
        <span className="min-w-0 truncate text-xs font-medium text-zinc-500">
          벌어야 할 돈 말고도 뭐가 있었는데
        </span>
      </Link>

      <div className="flex shrink-0 items-center">
        {isLoggedIn ? <Profile /> : <LoginButton />}
      </div>
    </header>
  );
}
