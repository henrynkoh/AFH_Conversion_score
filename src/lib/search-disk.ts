import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { money } from "@/lib/format";
import { nextSearches, type SavedSearch } from "@/lib/record";
import type { ScorePackage, Scenario } from "@/lib/types";
import { indicatorText, judgementText } from "@/lib/underwrite";

export function searchPaths(root = process.cwd()) {
  return {
    jsonPath: path.join(root, "data", "searches.json"),
    markdownPath: path.join(root, "docs", "SEARCH_RESULTS.md"),
  };
}

export function readSearchFile(root = process.cwd()): SavedSearch[] {
  const { jsonPath } = searchPaths(root);
  if (!existsSync(jsonPath)) return [];
  try {
    const parsed = JSON.parse(readFileSync(jsonPath, "utf8")) as SavedSearch[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSearchToDisk(pack: ScorePackage, when = new Date(), root = process.cwd()) {
  const existing = readSearchFile(root);
  const next = nextSearches(existing, pack, when);
  const added = next !== existing;
  if (added) writeSearchFile(next, root);
  return { added, count: next.length };
}

export function writeSearchFile(rows: SavedSearch[], root = process.cwd()) {
  const { jsonPath, markdownPath } = searchPaths(root);
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  mkdirSync(path.dirname(markdownPath), { recursive: true });
  writeFileSync(jsonPath, `${JSON.stringify(rows, null, 2)}\n`);
  writeFileSync(markdownPath, renderSearchResults(rows));
}

export function renderSearchResults(rows: SavedSearch[]): string {
  const chronological = [...rows].reverse();
  const chapters =
    chronological.length === 0
      ? "No search has been saved yet. The next score built on this desk is added at the bottom of this page.\n"
      : chronological.map((row, index) => renderChapter(row, index + 1, chronological.length)).join("\n");

  return `# Search results

Houses scored on this desk, oldest first. The list grows when the next search is built in this project. A repeated score of the same house, at the same list price and the same score, is not added twice.

The columns in each table are the rank, the indicators (cash flow, NPV, IRR, payback, ROI), and the 1–10 judgement with the reason.

${chapters}`;
}

function renderChapter(row: SavedSearch, number: number, total: number): string {
  const { pack } = row;
  const facts = pack.facts;
  const address = facts.address.trim() || "Untitled house";
  const checks = pack.checklist
    .map((item) => `- **${item.status}** — ${item.label}. ${item.detail}`)
    .join("\n");

  return `## ${number}. ${address}

Saved ${row.savedAt}. Search ${number} of ${total}.

List ${money(facts.listPrice)} · ${facts.beds} bd / ${facts.baths} ba · ${facts.garageSpaces}-car garage · ${facts.sewer} sewer · ${facts.county}. ${pack.phone.headline}.

${facts.sourceRef ? `Source: ${facts.sourceRef}\n` : ""}
${checks}

### Top 5 buy-box combinations

${scenarioTable(pack.topFive)}

### This list price, five leases

Scored at ${money(facts.listPrice)}, the price on the listing.

${scenarioTable(pack.atListPrice)}

### Phone brief

\`\`\`
${pack.phone.body}
\`\`\`
`;
}

function scenarioTable(rows: Scenario[]): string {
  const header = [
    "| Number | Name of indicators (cash flow, NPV, IRR, payback, ROI) | Overall judgement (1–10, reason and evidence) |",
    "| --- | --- | --- |",
  ];
  const body = rows.map((row, index) => {
    return `| ${index + 1} | ${cell(indicatorText(row))} | ${cell(judgementText(row))} |`;
  });
  return [...header, ...body].join("\n");
}

function cell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
}
