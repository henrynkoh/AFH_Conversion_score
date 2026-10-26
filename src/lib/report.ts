import { ASSUMPTIONS } from "@/lib/assumptions";
import { linspace, money, pct, years } from "@/lib/format";
import type {
  CheckItem,
  Facts,
  PhoneBrief,
  Scenario,
  ScorePackage,
} from "@/lib/types";
import { buildScenario } from "@/lib/underwrite";

export function blankFacts(): Facts {
  return {
    address: "",
    listPrice: 0,
    beds: 3,
    baths: 2,
    garageSpaces: 2,
    garageSqft: null,
    sewer: "unknown",
    septicSixBedApproved: false,
    sqft: null,
    hoaAnnual: 0,
    county: "unknown",
    within30Miles: "unknown",
    levelEntry: "unknown",
    ceilingClear: "unknown",
    remarks: "",
    sourceType: "manual",
    sourceRef: "",
    mlsNumber: "",
  };
}

export function rankScenarios(scenarios: Scenario[]): Scenario[] {
  return [...scenarios].sort((left, right) => {
    if (right.judgement.score !== left.judgement.score) {
      return right.judgement.score - left.judgement.score;
    }
    if (right.roi !== left.roi) return right.roi - left.roi;
    return right.ops.monthlyCashFlow - left.ops.monthlyCashFlow;
  });
}

function checklist(facts: Facts, atList: Scenario[]): CheckItem[] {
  const best = atList[0];
  const items: CheckItem[] = [];

  items.push(
    facts.listPrice >= ASSUMPTIONS.priceMin &&
      facts.listPrice <= ASSUMPTIONS.priceMax
      ? {
          id: "price",
          label: "Price inside the buy box",
          status: "pass",
          detail: `${money(facts.listPrice)} is between ${money(ASSUMPTIONS.priceMin)} and ${money(ASSUMPTIONS.priceMax)}.`,
        }
      : {
          id: "price",
          label: "Price inside the buy box",
          status: "watch",
          detail: `${money(facts.listPrice)} is outside ${money(ASSUMPTIONS.priceMin)}–${money(ASSUMPTIONS.priceMax)}. The math still runs.`,
        },
  );

  const inArea =
    (facts.county === "thurston" || facts.county === "lewis") &&
    facts.within30Miles !== "no";
  items.push({
    id: "area",
    label: "Thurston, Lewis, or the Tumwater radius",
    status:
      facts.county === "unknown" && facts.within30Miles === "unknown"
        ? "unknown"
        : inArea
          ? "pass"
          : "fail",
    detail: inArea
      ? `${facts.county === "lewis" ? "Lewis" : "Thurston"} County, measured from ${ASSUMPTIONS.hubLabel}.`
      : `Confirm the house is in ${ASSUMPTIONS.countiesLabel} or within ${ASSUMPTIONS.hubRadiusMiles} miles of the Tumwater hub. A city name is only a screen, not a surveyed radius.`,
  });

  items.push({
    id: "beds",
    label: "3+ bedrooms and 2+ baths today",
    status:
      facts.beds >= ASSUMPTIONS.minBeds && facts.baths >= ASSUMPTIONS.minBaths
        ? "pass"
        : "fail",
    detail: `${facts.beds} bed / ${facts.baths} bath. The plan adds garage bedrooms to reach ${ASSUMPTIONS.targetResidents} residents.`,
  });

  const garageOk = facts.garageSpaces >= ASSUMPTIONS.minGarageSpaces;
  const garageArea =
    facts.garageSqft === null
      ? "Square feet not entered."
      : facts.garageSqft >= ASSUMPTIONS.minGarageSqft
        ? `${facts.garageSqft} sq ft meets the 400 sq ft planning minimum.`
        : `${facts.garageSqft} sq ft is under 400.`;
  items.push({
    id: "garage",
    label: "2-car garage, about 400 sq ft",
    status: !garageOk ? "fail" : facts.garageSqft !== null && facts.garageSqft < 400 ? "watch" : garageOk && facts.garageSqft === null ? "watch" : "pass",
    detail: `${facts.garageSpaces} space${facts.garageSpaces === 1 ? "" : "s"}. ${garageArea}`,
  });

  if (facts.sewer === "public") {
    items.push({
      id: "sewer",
      label: "Sewer can serve 6 residents",
      status: "pass",
      detail: "Marked as public sewer.",
    });
  } else if (facts.sewer === "septic" && facts.septicSixBedApproved) {
    items.push({
      id: "sewer",
      label: "Sewer can serve 6 residents",
      status: "pass",
      detail: "Septic is marked as already approved for 6 bedrooms. Keep the permit in the file.",
    });
  } else if (facts.sewer === "septic") {
    items.push({
      id: "sewer",
      label: "Sewer can serve 6 residents",
      status: "fail",
      detail:
        "Septic without a 6-bedroom approval. Thurston County sizes systems by bedroom. A replacement often breaks the $10,000 extra budget. The model adds $15,000 and still may be light.",
    });
  } else {
    items.push({
      id: "sewer",
      label: "Sewer can serve 6 residents",
      status: "unknown",
      detail: "Sewer type was not in the pasted text.",
    });
  }

  items.push({
    id: "ceiling",
    label: "Garage can finish near 7.5 ft",
    status:
      facts.ceilingClear === "yes"
        ? "pass"
        : facts.ceilingClear === "no"
          ? "fail"
          : "unknown",
    detail:
      facts.ceilingClear === "yes"
        ? "You confirmed finished clearance."
        : "WABO-style garage conversions need living-space energy, moisture, and ceiling clearance after insulation and drywall. This desk does not inspect it.",
  });

  items.push({
    id: "entry",
    label: "Level entry or ramp inside the remodel",
    status:
      facts.levelEntry === "yes" ? "pass" : facts.levelEntry === "no" ? "watch" : "unknown",
    detail:
      facts.levelEntry === "yes"
        ? "Level entry or a rambler note was confirmed."
        : "Ask whether a ramp or a no-step door fits the $60,000 remodel.",
  });

  if (best) {
    items.push({
      id: "hold",
      label: "$20,000 covers six months of carry",
      status: best.ops.holdingGap > 5000 ? "fail" : best.ops.holdingGap > 0 ? "watch" : "pass",
      detail: `At the list price, six months of principal, interest, tax, insurance, and HOA is ${money(best.ops.sixMonthCarry)}. The cap is ${money(ASSUMPTIONS.holdingCosts6mo)}.`,
    });
  }

  items.push({
    id: "sprinkler",
    label: "Sprinkler question left open",
    status: "unknown",
    detail:
      "Some care conversions are asked for a residential sprinkler system. That bid is not inside the $60,000 remodel. Ask the building official before you treat the budget as complete.",
  });

  return items;
}

export function phoneBrief(facts: Facts, scenario: Scenario): PhoneBrief {
  const send = scenario.judgement.score >= ASSUMPTIONS.alertScoreMin;
  const place = facts.address.trim() || "Address not set";
  const body = [
    send ? "AFH MATCH" : "AFH HELD",
    place,
    facts.mlsNumber ? `MLS ${facts.mlsNumber}` : "",
    `List ${money(scenario.purchasePrice)}`,
    `Lease test ${money(scenario.monthlyRent)}/mo`,
    `Flow ${money(scenario.ops.monthlyCashFlow, 0)}/mo`,
    `NPV ${money(scenario.npv)}`,
    `IRR ${scenario.irr === null ? "n/a" : pct(scenario.irr, 1)}`,
    `Payback ${years(scenario.paybackYears)}`,
    `ROI ${pct(scenario.roi, 1)}`,
    `${scenario.judgement.score}/10 ${scenario.judgement.verdict}`,
    send
      ? "Desk screen only. Not a WABO pass."
      : `Under ${ASSUMPTIONS.alertScoreMin}/10. Not sent.`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    send,
    headline: send
      ? "Ready for your phone"
      : "Held on the desk",
    body,
  };
}

export function runPackage(facts: Facts):
  | { ok: true; pack: ScorePackage }
  | { ok: false; error: string } {
  if (!Number.isFinite(facts.listPrice) || facts.listPrice < 50_000) {
    return {
      ok: false,
      error:
        "Enter a list price of at least $50,000. The buy box is $450,000 to $550,000, and a price outside that range can still be scored.",
    };
  }
  if (facts.listPrice > 5_000_000) {
    return { ok: false, error: "That price is outside anything this desk underwrites." };
  }

  const prices = linspace(
    ASSUMPTIONS.priceMin,
    ASSUMPTIONS.priceMax,
    ASSUMPTIONS.scenarioCount,
  );
  const rents = linspace(
    ASSUMPTIONS.rentMin,
    ASSUMPTIONS.rentMax,
    ASSUMPTIONS.scenarioCount,
  );

  const grid = rankScenarios(
    prices.flatMap((price) =>
      rents.map((rent) => buildScenario(facts, price, rent)),
    ),
  );
  const atListPrice = rankScenarios(
    rents.map((rent) => buildScenario(facts, facts.listPrice, rent)),
  );
  const briefScenario = atListPrice[0];
  if (!briefScenario) {
    return { ok: false, error: "The lease grid did not produce a scenario." };
  }

  return {
    ok: true,
    pack: {
      facts,
      prices,
      rents,
      grid,
      topFive: grid.slice(0, 5),
      atListPrice,
      briefScenario,
      phone: phoneBrief(facts, briefScenario),
      checklist: checklist(facts, atListPrice),
    },
  };
}

export function scenarioKey(scenario: Scenario): string {
  return `${scenario.purchasePrice}-${scenario.monthlyRent}`;
}
