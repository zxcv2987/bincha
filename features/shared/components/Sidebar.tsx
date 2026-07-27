"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/", label: "할 일" },
  { href: "/results", label: "결과함" },
] as const;

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 md:w-48">
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
                "rounded-lg px-3 py-2 text-sm font-semibold whitespace-nowrap",
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
      {children}
    </aside>
  );
}
