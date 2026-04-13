"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/analyse", label: "Analyser mon CV" },
  { href: "/ats", label: "Comprendre les ATS" },
  { href: "/a-propos", label: "A propos" },
  { href: "/confidentialite", label: "Confidentialite" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="w-full px-[clamp(1rem,4vw,4.5rem)] py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 rounded-[16px] border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-black tracking-wide text-[var(--color-ink)] shadow-hard-xs"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border-2 border-[var(--color-border)] bg-[var(--color-brand-light)] text-[var(--color-brand)]">
              <BarChart3 className="h-5 w-5" aria-hidden="true" suppressHydrationWarning />
            </span>
            ATS FILTER
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-2 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[14px] border-2 px-4 py-2 text-sm font-bold transition",
                    active
                      ? "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand)] shadow-hard-xs"
                      : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-border)] hover:-translate-y-0.5 hover:bg-[var(--color-surface-muted)]",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/analyse"
            className="inline-flex h-11 items-center rounded-[14px] border-2 border-[var(--color-border)] bg-[var(--color-brand)] px-5 text-sm font-black uppercase tracking-wide text-white shadow-hard-xs transition hover:-translate-y-0.5 hover:bg-[#6d28d9]"
          >
            Analyse Express
          </Link>
        </div>

        <nav aria-label="Navigation mobile" className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={cn(
                  "whitespace-nowrap rounded-[12px] border-2 px-3 py-2 text-xs font-bold",
                  active
                    ? "border-[var(--color-brand)] bg-[var(--color-brand-light)] text-[var(--color-brand)]"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
