import type { Metadata } from "next";
import { ArchiveBoard } from "@/components/archive-board";

export const metadata: Metadata = {
  title: "Deal book",
};

export default function ArchivePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Control</p>
      <h1 className="mt-2 font-display text-4xl text-pine">Deal book</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
        Rows are written in this browser when you build a score. Click a row to
        read the phone brief. Download the CSV when you want the sheet in a
        spreadsheet.
      </p>
      <div className="mt-8">
        <ArchiveBoard />
      </div>
    </main>
  );
}
