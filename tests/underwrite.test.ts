import assert from "node:assert/strict";
import test from "node:test";
import { ASSUMPTIONS } from "../src/lib/assumptions.ts";
import { linspace } from "../src/lib/format.ts";
import { parseIntake } from "../src/lib/parse-listing.ts";
import { runPackage } from "../src/lib/report.ts";
import { sampleFacts } from "../src/lib/sample.ts";
import {
  buildScenario,
  internalRateOfReturn,
  monthlyPayment,
  netPresentValue,
  remainingBalance,
} from "../src/lib/underwrite.ts";

test("price and rent grids match the five-step buy box", () => {
  assert.deepEqual(linspace(450_000, 550_000, 5), [
    450_000, 475_000, 500_000, 525_000, 550_000,
  ]);
  assert.deepEqual(linspace(3_500, 6_000, 5), [3500, 4125, 4750, 5375, 6000]);
});

test("amortization matches a known 6% mortgage", () => {
  const payment = monthlyPayment(100_000, 0.06, 30);
  assert.ok(Math.abs(payment - 599.55) < 0.05, String(payment));
  assert.ok(Math.abs(remainingBalance(100_000, 0.06, 30, 0) - 100_000) < 1);
  assert.ok(remainingBalance(100_000, 0.06, 30, 360) < 2);
});

test("IRR is a solved rate, not a polynomial root", () => {
  const rate = internalRateOfReturn([-100, 60, 60]);
  assert.ok(rate !== null);
  assert.ok(Math.abs(rate - 0.130662) < 0.0005, String(rate));
  assert.ok(Math.abs(netPresentValue(0.1, [-100, 110])) < 1e-9);
});

test("a clean Tumwater sample at the top lease clears the send line", () => {
  const result = runPackage(sampleFacts());
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.equal(result.pack.grid.length, 25);
  assert.equal(result.pack.topFive.length, 5);
  assert.equal(result.pack.topFive[0].purchasePrice, 450_000);
  assert.equal(result.pack.topFive[0].monthlyRent, 6_000);
  assert.ok(result.pack.topFive[0].judgement.score >= 8);
  assert.equal(result.pack.briefScenario.purchasePrice, 495_000);
  assert.equal(result.pack.briefScenario.monthlyRent, 6_000);
  assert.equal(result.pack.briefScenario.judgement.verdict, "Invest");
  assert.equal(result.pack.phone.send, true);
  assert.match(result.pack.phone.body, /Desk screen only/);
  assert.doesNotMatch(result.pack.phone.body, /WABO Ready|inspection passed/i);
});

test("septic and a short garage raise cash in and cap the score", () => {
  const clean = buildScenario(sampleFacts(), 495_000, 6_000);
  const hard = buildScenario(
    {
      ...sampleFacts(),
      sewer: "septic",
      septicSixBedApproved: false,
      garageSpaces: 1,
      ceilingClear: "unknown",
    },
    495_000,
    6_000,
  );
  assert.equal(
    hard.stack.totalCashInvested - clean.stack.totalCashInvested,
    ASSUMPTIONS.septicExtra + ASSUMPTIONS.garageShortfallExtra,
  );
  assert.ok(hard.judgement.score <= 6);
  assert.equal(hard.judgement.verdict === "Invest", false);
});

test("the low lease on the sample does not get a text", () => {
  const thin = buildScenario(sampleFacts(), 495_000, 3_500);
  assert.ok(thin.ops.monthlyCashFlow < 500);
  assert.equal(thin.judgement.score, 2);
  assert.equal(thin.judgement.verdict, "Pass");
});

test("parser reads a Zillow slug, a Matrix lock, and Agent Full text", () => {
  const zillow = parseIntake(
    "https://www.zillow.com/homedetails/8832-Case-Rd-SW-Tumwater-WA-98512/123_zpid/",
  );
  assert.equal(zillow.sourceType, "zillow");
  assert.equal(zillow.patch.address, "8832 Case Rd SW Tumwater WA 98512");
  assert.equal(zillow.patch.county, "thurston");
  assert.equal(zillow.locked, false);

  const matrix = parseIntake(
    "https://www.matrix.nwmls.com/Matrix/Results.aspx?c=abc",
  );
  assert.equal(matrix.locked, true);
  assert.match(matrix.notes.join(" "), /does not sign in/);

  const pasted = parseIntake(
    "NWMLS 2451188",
    `Address: 120 Cedar Ct, Centralia WA
List Price: $465,000
Bedrooms: 4
Bathrooms: 2.5
Garage Spaces: 2
Sewer: Septic
Remarks: Rambler on a level lot.`,
  );
  assert.equal(pasted.patch.mlsNumber, "2451188");
  assert.equal(pasted.patch.listPrice, 465_000);
  assert.equal(pasted.patch.beds, 4);
  assert.equal(pasted.patch.baths, 2.5);
  assert.equal(pasted.patch.garageSpaces, 2);
  assert.equal(pasted.patch.sewer, "septic");
  assert.equal(pasted.patch.county, "lewis");
  assert.equal(pasted.patch.levelEntry, "yes");
});
