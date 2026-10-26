"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IphoneBrief } from "@/components/iphone-brief";
import { ScoreTable } from "@/components/score-table";
import { readArchive, rowFromPackage, writeArchive } from "@/lib/archive";
import { money, pct } from "@/lib/format";
import { parseIntake } from "@/lib/parse-listing";
import { blankFacts, phoneBrief, runPackage, scenarioKey } from "@/lib/report";
import { SAMPLE_ENTRY, SAMPLE_LISTING, sampleFacts } from "@/lib/sample";
import type { Facts, ScorePackage } from "@/lib/types";

const SEWER_ITEMS = {
  public: "Public sewer",
  septic: "Septic",
  unknown: "Not set",
} as const;

const COUNTY_ITEMS = {
  thurston: "Thurston County",
  lewis: "Lewis County",
  other: "Outside both",
  unknown: "Not set",
} as const;

const TRI_ITEMS = {
  yes: "Yes",
  no: "No",
  unknown: "Not checked",
} as const;

export function Analyzer() {
  const [entry, setEntry] = useState("");
  const [listingText, setListingText] = useState("");
  const [facts, setFacts] = useState<Facts>(blankFacts());
  const [notes, setNotes] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [pack, setPack] = useState<ScorePackage | null>(null);
  const [logged, setLogged] = useState("");
  const [briefKey, setBriefKey] = useState("");

  const briefScenario = useMemo(() => {
    if (!pack) return null;
    return (
      pack.atListPrice.find((scenario) => scenarioKey(scenario) === briefKey) ??
      pack.briefScenario
    );
  }, [pack, briefKey]);

  function readIntoForm() {
    const parsed = parseIntake(entry, listingText);
    setNotes(parsed.notes);
    setFacts((current) => ({
      ...current,
      ...parsed.patch,
      sourceType: parsed.patch.sourceType ?? current.sourceType,
    }));
    setError("");
  }

  function scoreFacts(next: Facts) {
    const result = runPackage(next);
    if (!result.ok) {
      setPack(null);
      setError(result.error);
      setLogged("");
      return;
    }
    setError("");
    setPack(result.pack);
    setBriefKey(scenarioKey(result.pack.briefScenario));
    const row = rowFromPackage(result.pack);
    const existing = readArchive();
    const duplicate =
      existing[0]?.address === row.address &&
      existing[0]?.listPrice === row.listPrice &&
      existing[0]?.score === row.score;
    if (!duplicate) writeArchive([row, ...existing].slice(0, 200));
    setLogged(
      duplicate
        ? "This score is already the latest row in the deal book."
        : `Logged ${row.address} in this browser.`,
    );
  }

  function loadSample() {
    const sample = sampleFacts();
    setEntry(SAMPLE_ENTRY);
    setListingText(SAMPLE_LISTING);
    setFacts(sample);
    setNotes([
      "Worked example loaded. Sample Rambler is not a live listing.",
      "Ceiling clearance and level entry are marked confirmed so you can see a full pass. A real house starts with those items unchecked.",
    ]);
    scoreFacts(sample);
  }

  const activeBrief = briefScenario && facts ? phoneBrief(facts, briefScenario) : null;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[340px_minmax(0,1fr)]">
      <form
        className="no-print space-y-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-auto lg:pr-2"
        onSubmit={(event) => {
          event.preventDefault();
          scoreFacts(facts);
        }}
      >
        <div>
          <h1 className="font-display text-3xl text-pine">Score a listing</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Paste a Zillow link, a website link, a street address, or an NWMLS
            number. Add the Agent Full text when the link is only a session.
          </p>
        </div>

        <Field label="Link, address, or NWMLS number" htmlFor="entry">
          <Textarea
            id="entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="https://www.zillow.com/homedetails/… or 120 Cedar Ct, Centralia WA"
            className="min-h-24"
          />
        </Field>

        <Field label="Listing text, optional" htmlFor="listing">
          <Textarea
            id="listing"
            value={listingText}
            onChange={(event) => setListingText(event.target.value)}
            placeholder="Address, list price, beds, baths, garage, sewer, remarks"
            className="min-h-28"
          />
        </Field>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={readIntoForm}>
            Read into the form
          </Button>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load worked example
          </Button>
        </div>

        {notes.length > 0 && (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Address" htmlFor="address" className="col-span-2">
            <Input
              id="address"
              value={facts.address}
              onChange={(event) => setFacts({ ...facts, address: event.target.value })}
            />
          </Field>
          <Field label="List price" htmlFor="price">
            <Input
              id="price"
              inputMode="decimal"
              value={facts.listPrice || ""}
              onChange={(event) =>
                setFacts({ ...facts, listPrice: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="NWMLS number" htmlFor="mls">
            <Input
              id="mls"
              value={facts.mlsNumber}
              onChange={(event) => setFacts({ ...facts, mlsNumber: event.target.value })}
            />
          </Field>
          <Field label="Beds" htmlFor="beds">
            <Input
              id="beds"
              inputMode="numeric"
              value={facts.beds}
              onChange={(event) => setFacts({ ...facts, beds: Number(event.target.value) })}
            />
          </Field>
          <Field label="Baths" htmlFor="baths">
            <Input
              id="baths"
              inputMode="decimal"
              value={facts.baths}
              onChange={(event) => setFacts({ ...facts, baths: Number(event.target.value) })}
            />
          </Field>
          <Field label="Garage spaces" htmlFor="garage">
            <Input
              id="garage"
              inputMode="numeric"
              value={facts.garageSpaces}
              onChange={(event) =>
                setFacts({ ...facts, garageSpaces: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="Garage sq ft" htmlFor="garage-sqft">
            <Input
              id="garage-sqft"
              inputMode="numeric"
              value={facts.garageSqft ?? ""}
              onChange={(event) =>
                setFacts({
                  ...facts,
                  garageSqft: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </Field>
          <Field label="House sq ft" htmlFor="sqft">
            <Input
              id="sqft"
              inputMode="numeric"
              value={facts.sqft ?? ""}
              onChange={(event) =>
                setFacts({
                  ...facts,
                  sqft: event.target.value === "" ? null : Number(event.target.value),
                })
              }
            />
          </Field>
          <Field label="HOA per year" htmlFor="hoa">
            <Input
              id="hoa"
              inputMode="decimal"
              value={facts.hoaAnnual}
              onChange={(event) =>
                setFacts({ ...facts, hoaAnnual: Number(event.target.value) })
              }
            />
          </Field>
        </div>

        <Choice
          label="Sewer"
          value={facts.sewer}
          items={SEWER_ITEMS}
          onChange={(sewer) => setFacts({ ...facts, sewer })}
        />
        <label className="flex items-start gap-2 text-sm">
          <Checkbox
            checked={facts.septicSixBedApproved}
            onCheckedChange={(checked) =>
              setFacts({ ...facts, septicSixBedApproved: checked })
            }
          />
          <span>Septic approval already covers 6 bedrooms</span>
        </label>
        <Choice
          label="County"
          value={facts.county}
          items={COUNTY_ITEMS}
          onChange={(county) => setFacts({ ...facts, county })}
        />
        <Choice
          label="Within 30 miles of 3571 Cassie Drive SW"
          value={facts.within30Miles}
          items={TRI_ITEMS}
          onChange={(within30Miles) => setFacts({ ...facts, within30Miles })}
        />
        <Choice
          label="Level entry or rambler"
          value={facts.levelEntry}
          items={TRI_ITEMS}
          onChange={(levelEntry) => setFacts({ ...facts, levelEntry })}
        />
        <Choice
          label="Garage can finish near 7.5 ft"
          value={facts.ceilingClear}
          items={TRI_ITEMS}
          onChange={(ceilingClear) => setFacts({ ...facts, ceilingClear })}
        />

        {error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Button
          type="button"
          size="lg"
          className="h-11 w-full"
          onClick={() => scoreFacts(facts)}
        >
          Build the score package
        </Button>
        {logged && <p className="text-sm text-muted-foreground">{logged}</p>}
      </form>

      <div className="space-y-8">
        {!pack || !briefScenario || !activeBrief ? (
          <EmptyDesk />
        ) : (
          <Results
            pack={pack}
            brief={activeBrief}
            onPickLease={(key) => setBriefKey(key)}
            briefKey={scenarioKey(briefScenario)}
          />
        )}
      </div>
    </div>
  );
}

function Results({
  pack,
  brief,
  briefKey,
  onPickLease,
}: {
  pack: ScorePackage;
  brief: ScorePackage["phone"];
  briefKey: string;
  onPickLease: (key: string) => void;
}) {
  const stack = pack.briefScenario.stack;
  const heartbeat = [
    "Desk check",
    "Routine loaded in this browser.",
    "No morning text is scheduled from this server.",
    "Deal book stays on this device.",
  ].join("\n");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-[0.16em] text-copper uppercase">Score package</p>
          <h2 className="font-display text-3xl text-pine">
            {pack.facts.address || "Untitled house"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            List {money(pack.facts.listPrice)} · {pack.facts.beds} bd / {pack.facts.baths} ba ·{" "}
            {pack.facts.garageSpaces}-car garage · {pack.facts.sewer} sewer
          </p>
        </div>
        <Badge variant={brief.send ? "default" : "secondary"}>
          {brief.send ? "Phone brief ready" : "Held under 8"}
        </Badge>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="order-2 space-y-8 xl:order-1">
          <section className="grid gap-3 sm:grid-cols-4">
            <Stat label="Cash in" value={money(stack.totalCashInvested)} />
            <Stat label="Down payment" value={money(stack.downPayment)} />
            <Stat label="Remodel + extra" value={money(stack.remodeling + stack.extra)} />
            <Stat label="Six-month hold" value={money(stack.holding)} />
          </section>
          {stack.notes.length > 0 && (
            <ul className="space-y-1 text-sm">
              {stack.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <section>
            <h3 className="font-display text-xl text-pine">Conversion screen</h3>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
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
          </section>

          <ScoreTable
            rows={pack.topFive}
            title="Top 5 buy-box combinations"
            note="Five prices from $450,000 to $550,000 and five leases from $3,500 to $6,000, ranked by score, then cash-on-cash return, then monthly cash flow. Physical penalties on this house apply to every cell."
          />

          <section className="space-y-3">
            <h3 className="font-display text-2xl text-pine">This list price, five leases</h3>
            <p className="text-sm text-muted-foreground">
              You cannot buy this house at a cheaper grid price. These five rows use{" "}
              {money(pack.facts.listPrice)}. Pick the lease the phone brief should use.
            </p>
            <div className="flex flex-wrap gap-2">
              {[...pack.atListPrice]
                .sort((left, right) => left.monthlyRent - right.monthlyRent)
                .map((scenario) => (
                <Button
                  key={scenarioKey(scenario)}
                  type="button"
                  variant={scenarioKey(scenario) === briefKey ? "default" : "outline"}
                  onClick={() => onPickLease(scenarioKey(scenario))}
                >
                  {money(scenario.monthlyRent)} · {scenario.judgement.score}/10
                </Button>
              ))}
            </div>
            <ScoreTable
              rows={pack.atListPrice}
              title="Lease sensitivity"
              note={`Ranked at the list price. ROI on the brief row is ${pct(pack.atListPrice.find((scenario) => scenarioKey(scenario) === briefKey)?.roi ?? 0, 1)}.`}
            />
          </section>

          <Matrix pack={pack} />
        </div>
        <div className="order-1 xl:order-2">
          <IphoneBrief brief={brief} heartbeat={heartbeat} />
          <p className="mx-auto mt-3 max-w-[300px] text-center text-xs leading-5 text-muted-foreground">
            T-Mobile no longer turns email into a text at tmomail.net. Copy the
            brief from the deal book if you want it on the phone. If an app
            password was pasted into an earlier chat, revoke it in your Google
            Account security settings. This app does not store one.
          </p>
        </div>
      </div>
    </div>
  );
}

function Matrix({ pack }: { pack: ScorePackage }) {
  return (
    <section className="space-y-3">
      <h3 className="font-display text-2xl text-pine">All 25 cells</h3>
      <p className="text-sm text-muted-foreground">
        Score in each cell. The list price is called out above when it is not one of these five prices.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-2 text-left font-medium">Price \ lease</th>
              {pack.rents.map((rent) => (
                <th key={rent} className="p-2 text-right font-medium">
                  {money(rent)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pack.prices.map((price) => (
              <tr key={price} className="border-t border-border">
                <th className="p-2 text-left font-medium">{money(price)}</th>
                {pack.rents.map((rent) => {
                  const cell = pack.grid.find(
                    (scenario) =>
                      scenario.purchasePrice === price && scenario.monthlyRent === rent,
                  );
                  return (
                    <td key={rent} className="p-2 text-right font-mono">
                      {cell ? `${cell.judgement.score}` : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EmptyDesk() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Waiting for a house</p>
      <h2 className="mt-2 font-display text-3xl text-pine">The same sheet, every listing</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>Paste the link, the address, or the NWMLS number.</li>
        <li>If Matrix is locked, paste the Agent Full text beside it.</li>
        <li>Confirm beds, baths, garage, sewer, and the Tumwater radius.</li>
        <li>Build the package. Keep scores of 8 and above.</li>
        <li>The phone preview is the brief. The deal book keeps the row.</li>
      </ol>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl text-pine">{value}</p>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1.5 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Choice<T extends string>({
  label,
  value,
  items,
  onChange,
}: {
  label: string;
  value: T;
  items: Record<T, string>;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Select
        items={items}
        value={value}
        onValueChange={(next) => {
          if (next) onChange(next);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(items) as T[]).map((key) => (
            <SelectItem key={key} value={key}>
              {items[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
