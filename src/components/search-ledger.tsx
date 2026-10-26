"use client";

import { useSyncExternalStore } from "react";
import { IphoneBrief } from "@/components/iphone-brief";
import { ScoreTable } from "@/components/score-table";
import { readRecord, subscribeRecord, type SavedSearch } from "@/lib/record";
import { money } from "@/lib/format";

const EMPTY: SavedSearch[] = [];

function emptyRecord() {
  return EMPTY;
}

export function SearchLedger() {
  const rows = useSyncExternalStore(subscribeRecord, readRecord, emptyRecord);
  const chronological = [...rows].reverse();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Added as you search</p>
      <h2 className="mt-2 font-display text-4xl text-pine">Searches in this record</h2>
      <p className="mt-4 max-w-3xl text-[15px] leading-7">
        Each time you build a score package, that house is added here, newest last.
        The worked example in the tutorial above is the first complete result. These
        rows are the houses you actually run, kept in this browser.
      </p>
      {chronological.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-sm leading-6">
          No search has been added yet. Use the score desk at the end of this
          record. The next house will show up in this chapter with its top 5,
          its list-price leases, and its phone brief.
        </p>
      ) : (
        <ol className="mt-8 space-y-12">
          {chronological.map((row, index) => (
            <li key={row.id}>
              <SearchChapter number={index + 1} total={chronological.length} row={row} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function SearchChapter({
  number,
  total,
  row,
}: {
  number: number;
  total: number;
  row: SavedSearch;
}) {
  const { pack } = row;
  const facts = pack.facts;
  return (
    <article className="space-y-6 border-t border-border pt-8">
      <div>
        <p className="text-xs tracking-[0.16em] text-copper uppercase">
          Search {number} of {total} · {row.savedAt}
        </p>
        <h3 className="mt-2 font-display text-3xl text-pine">
          {facts.address || "Untitled house"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          List {money(facts.listPrice)} · {facts.beds} bd / {facts.baths} ba ·{" "}
          {facts.garageSpaces}-car garage · {facts.sewer} sewer · {facts.county} ·{" "}
          {pack.phone.headline}
        </p>
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border bg-card">
        {pack.checklist.map((item) => (
          <li key={item.id} className="grid gap-1 px-4 py-3 sm:grid-cols-[9rem_1fr]">
            <span className="text-xs tracking-wide text-copper uppercase">{item.status}</span>
            <span>
              <span className="font-medium">{item.label}</span>
              <span className="mt-1 block text-sm text-muted-foreground">{item.detail}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          <ScoreTable
            rows={pack.topFive}
            title="Top 5 buy-box combinations"
            note="Ranked by score, then cash-on-cash return, then monthly cash flow."
          />
          <ScoreTable
            rows={pack.atListPrice}
            title="This list price, five leases"
            note={`Scored at ${money(facts.listPrice)}, the price on the listing.`}
          />
        </div>
        <IphoneBrief
          brief={pack.phone}
          heartbeat={"Desk check\nAdded to the project record.\nNo text was sent."}
        />
      </div>
    </article>
  );
}
