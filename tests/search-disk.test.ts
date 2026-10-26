import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { readSearchFile, renderSearchResults, saveSearchToDisk } from "../src/lib/search-disk.ts";
import { runPackage } from "../src/lib/report.ts";
import { sampleFacts } from "../src/lib/sample.ts";

test("a scored house is written once and the results page grows for the next house", () => {
  const result = runPackage(sampleFacts());
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const root = mkdtempSync(path.join(tmpdir(), "afh-searches-"));
  const first = saveSearchToDisk(result.pack, new Date("2026-10-26T05:33:00Z"), root);
  assert.equal(first.added, true);
  assert.equal(first.count, 1);

  const again = saveSearchToDisk(result.pack, new Date("2026-10-26T06:00:00Z"), root);
  assert.equal(again.added, false);
  assert.equal(again.count, 1);

  const nextHouse = structuredClone(result.pack);
  nextHouse.facts.address = "120 Cedar Ct, Centralia WA";
  nextHouse.facts.listPrice = 480_000;
  const second = saveSearchToDisk(nextHouse, new Date("2026-10-26T07:00:00Z"), root);
  assert.equal(second.added, true);
  assert.equal(second.count, 2);

  const saved = readSearchFile(root);
  assert.equal(saved[0]?.pack.facts.address, "120 Cedar Ct, Centralia WA");
  const page = readFileSync(path.join(root, "docs", "SEARCH_RESULTS.md"), "utf8");
  assert.match(page, /## 1\. Sample Rambler SW, Tumwater WA/);
  assert.match(page, /## 2\. 120 Cedar Ct, Centralia WA/);
  assert.match(renderSearchResults(saved), /Search results/);
});
