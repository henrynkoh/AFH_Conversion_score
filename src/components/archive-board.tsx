"use client";

import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { readArchive, subscribeArchive, toCsv, writeArchive } from "@/lib/archive";
import { money, pct, years } from "@/lib/format";
import type { ArchiveRow } from "@/lib/types";

const EMPTY: ArchiveRow[] = [];

function emptyArchive() {
  return EMPTY;
}

export function ArchiveBoard() {
  const rows = useSyncExternalStore(subscribeArchive, readArchive, emptyArchive);
  const [openId, setOpenId] = useState<string | null>(null);

  function clear() {
    writeArchive([]);
    setOpenId(null);
  }

  function download() {
    const blob = new Blob([toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "afh-conversion-score.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-10">
        <h2 className="font-display text-3xl text-pine">No deals logged yet</h2>
        <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
          Score a listing and the row lands here, in this browser only. Nothing
          is uploaded.
        </p>
      </div>
    );
  }

  const open = rows.find((row) => row.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={download}>
          Download CSV
        </Button>
        <Button type="button" variant="ghost" onClick={clear}>
          Clear this browser
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Lease</TableHead>
            <TableHead>Cash flow</TableHead>
            <TableHead>ROI</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              className="cursor-pointer"
              onClick={() => setOpenId(row.id === openId ? null : row.id)}
            >
              <TableCell>{row.savedAt}</TableCell>
              <TableCell>{row.address}</TableCell>
              <TableCell>{money(row.listPrice)}</TableCell>
              <TableCell>{money(row.lease)}</TableCell>
              <TableCell>{money(row.monthlyCashFlow, 0)}/mo</TableCell>
              <TableCell>{pct(row.roi, 1)}</TableCell>
              <TableCell>
                {row.score}/10 {row.verdict}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {open && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs tracking-[0.14em] text-copper uppercase">Phone brief</p>
          <pre className="mt-2 font-mono text-sm whitespace-pre-wrap">{open.phoneBody}</pre>
          <p className="mt-3 text-sm text-muted-foreground">
            NPV {money(open.npv)} · IRR {open.irr === null ? "n/a" : pct(open.irr, 1)} · Payback{" "}
            {years(open.paybackYears)} · {open.sewer} sewer · {open.garageSpaces}-car garage
          </p>
        </div>
      )}
    </div>
  );
}
