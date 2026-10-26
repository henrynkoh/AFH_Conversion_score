import { stamp } from "@/lib/format";
import type { ArchiveRow, ScorePackage } from "@/lib/types";

export const ARCHIVE_KEY = "afh-conversion-score.v1";
export const ARCHIVE_EVENT = "afh-archive-change";

const EMPTY_ROWS: ArchiveRow[] = [];
let cachedRaw = "";
let cachedRows: ArchiveRow[] = EMPTY_ROWS;

export function readArchive(): ArchiveRow[] {
  if (typeof window === "undefined") return EMPTY_ROWS;
  const raw = window.localStorage.getItem(ARCHIVE_KEY) ?? "";
  if (raw === cachedRaw) return cachedRows;
  cachedRaw = raw;
  cachedRows = parseArchive(raw);
  return cachedRows;
}

export function writeArchive(rows: ArchiveRow[]) {
  const raw = JSON.stringify(rows);
  window.localStorage.setItem(ARCHIVE_KEY, raw);
  cachedRaw = raw;
  cachedRows = rows;
  window.dispatchEvent(new Event(ARCHIVE_EVENT));
}

export function subscribeArchive(onStoreChange: () => void) {
  window.addEventListener(ARCHIVE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(ARCHIVE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function parseArchive(raw: string): ArchiveRow[] {
  if (!raw) return EMPTY_ROWS;
  try {
    const parsed = JSON.parse(raw) as ArchiveRow[];
    return Array.isArray(parsed) ? parsed : EMPTY_ROWS;
  } catch {
    return EMPTY_ROWS;
  }
}

export function rowFromPackage(pack: ScorePackage, when = new Date()): ArchiveRow {
  const scenario = pack.briefScenario;
  const address = pack.facts.address.trim() || "Address not set";
  return {
    id: `AFH-${when.getTime().toString(36)}`,
    savedAt: stamp(when),
    address,
    sourceRef: pack.facts.sourceRef,
    listPrice: scenario.purchasePrice,
    lease: scenario.monthlyRent,
    monthlyCashFlow: scenario.ops.monthlyCashFlow,
    npv: scenario.npv,
    irr: scenario.irr,
    paybackYears: scenario.paybackYears,
    roi: scenario.roi,
    score: scenario.judgement.score,
    verdict: scenario.judgement.verdict,
    sewer: pack.facts.sewer,
    garageSpaces: pack.facts.garageSpaces,
    county: pack.facts.county,
    phoneBody: pack.phone.body,
  };
}

export function toCsv(rows: ArchiveRow[]): string {
  const header = [
    "Saved",
    "Address",
    "Source",
    "List price",
    "Lease test",
    "Monthly cash flow",
    "NPV",
    "IRR",
    "Payback years",
    "ROI",
    "Score",
    "Verdict",
    "Sewer",
    "Garage spaces",
    "County",
  ];
  const lines = rows.map((row) =>
    [
      row.savedAt,
      row.address,
      row.sourceRef,
      row.listPrice,
      row.lease,
      row.monthlyCashFlow.toFixed(2),
      row.npv.toFixed(2),
      row.irr === null ? "" : row.irr.toFixed(4),
      Number.isFinite(row.paybackYears) ? row.paybackYears.toFixed(2) : "",
      row.roi.toFixed(4),
      row.score,
      row.verdict,
      row.sewer,
      row.garageSpaces,
      row.county,
    ]
      .map(csvCell)
      .join(","),
  );
  return [header.join(","), ...lines].join("\n");
}

function csvCell(value: string | number): string {
  const text = String(value);
  if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
}
