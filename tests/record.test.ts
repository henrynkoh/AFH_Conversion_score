import assert from "node:assert/strict";
import test from "node:test";
import { nextSearches } from "../src/lib/record.ts";
import { runPackage } from "../src/lib/report.ts";
import { sampleFacts } from "../src/lib/sample.ts";

test("searches accumulate and a repeated score is not added twice", () => {
  const result = runPackage(sampleFacts());
  assert.equal(result.ok, true);
  if (!result.ok) return;

  const first = nextSearches([], result.pack, new Date("2026-10-26T15:00:00Z"));
  assert.equal(first.length, 1);
  assert.equal(first[0]?.pack.facts.address, "Sample Rambler SW, Tumwater WA");
  assert.match(first[0]?.savedAt ?? "", /PT$/);

  const again = nextSearches(first, result.pack);
  assert.equal(again, first);

  const nextHouse = structuredClone(result.pack);
  nextHouse.facts.address = "120 Cedar Ct, Centralia WA";
  const second = nextSearches(first, nextHouse, new Date("2026-10-26T16:00:00Z"));
  assert.equal(second.length, 2);
  assert.equal(second[0]?.pack.facts.address, "120 Cedar Ct, Centralia WA");
  assert.equal(second[1]?.pack.facts.address, "Sample Rambler SW, Tumwater WA");
});
