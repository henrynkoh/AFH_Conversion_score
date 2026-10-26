import { stamp } from "@/lib/format";
import type { ScorePackage } from "@/lib/types";

export const RECORD_KEY = "afh-conversion-score.record.v1";
export const RECORD_EVENT = "afh-record-change";

export type SavedSearch = {
  id: string;
  savedAt: string;
  pack: ScorePackage;
};

const EMPTY: SavedSearch[] = [];
let cachedRaw = "";
let cached: SavedSearch[] = EMPTY;

export function readRecord(): SavedSearch[] {
  if (typeof window === "undefined") return EMPTY;
  const raw = window.localStorage.getItem(RECORD_KEY) ?? "";
  if (raw === cachedRaw) return cached;
  cachedRaw = raw;
  cached = parseRecord(raw);
  return cached;
}

export function writeRecord(rows: SavedSearch[]) {
  const raw = JSON.stringify(rows);
  window.localStorage.setItem(RECORD_KEY, raw);
  cachedRaw = raw;
  cached = rows;
  window.dispatchEvent(new Event(RECORD_EVENT));
}

export function subscribeRecord(onStoreChange: () => void) {
  window.addEventListener(RECORD_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(RECORD_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function sameSearch(left: ScorePackage, right: ScorePackage): boolean {
  return (
    left.facts.address.trim() === right.facts.address.trim() &&
    left.briefScenario.purchasePrice === right.briefScenario.purchasePrice &&
    left.briefScenario.judgement.score === right.briefScenario.judgement.score
  );
}

export function nextSearches(
  existing: SavedSearch[],
  pack: ScorePackage,
  when = new Date(),
): SavedSearch[] {
  if (existing[0] && sameSearch(existing[0].pack, pack)) return existing;
  const frozen = JSON.parse(JSON.stringify(pack)) as ScorePackage;
  const row: SavedSearch = {
    id: `AFH-${when.getTime().toString(36)}`,
    savedAt: stamp(when),
    pack: frozen,
  };
  return [row, ...existing].slice(0, 100);
}

export function appendSearch(pack: ScorePackage, when = new Date()) {
  const next = nextSearches(readRecord(), pack, when);
  if (next !== readRecord()) writeRecord(next);
}

function parseRecord(raw: string): SavedSearch[] {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as SavedSearch[];
    return Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}
