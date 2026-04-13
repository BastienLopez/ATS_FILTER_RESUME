import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main className="w-full flex-1 px-[clamp(1rem,4vw,4.5rem)] py-8 md:py-10">{children}</main>
      <SiteFooter />
    </>
  );
}
