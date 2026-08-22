"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "할 일" },
  { href: "/results", label: "결과함" },
  { href: "/memos", label: "메모" },
] as const;

export default function Sidebar({
  children,
  childrenClassName,
}: {
  children?: React.ReactNode;
  childrenClassName?: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 md:w-48">
      <nav
        aria-label="주요 메뉴"
        className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible"
      >
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:outline-none",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      {children && (
        <div
          className={clsx(
            "flex flex-col gap-5 border-t border-zinc-200 pt-5",
            childrenClassName,
          )}
        >
          {children}
        </div>
      )}
    </aside>
  );
}
