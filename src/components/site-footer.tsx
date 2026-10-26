import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl">
          Planning screen for a 6-resident Adult Family Home lease. Not a loan
          commitment, a tax opinion, a DSHS licensing decision, or a WABO
          inspection result.
        </p>
        <div className="flex gap-4">
          <Link href="/guide/quickstart" className="underline underline-offset-4">
            Quickstart
          </Link>
          <Link href="/guide/manual" className="underline underline-offset-4">
            Manual
          </Link>
          <Link href="/assumptions" className="underline underline-offset-4">
            Assumptions
          </Link>
        </div>
      </div>
    </footer>
  );
}
