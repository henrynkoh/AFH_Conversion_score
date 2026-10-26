"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

const LINKS = [
  { href: "/record", label: "Record" },
  { href: "/analyze", label: "Score" },
  { href: "/archive", label: "Deal book" },
  { href: "/method", label: "Six Sigma" },
  { href: "/assumptions", label: "Assumptions" },
  { href: "/guide", label: "Guides" },
  { href: "/marketing", label: "Marketing" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-[#f7f3ea]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="min-w-0">
          <span className="block font-display text-lg leading-none text-pine">
            AFH Conversion Score
          </span>
          <span className="mt-1 block text-[11px] tracking-[0.14em] text-muted-foreground uppercase">
            Tumwater desk
          </span>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
