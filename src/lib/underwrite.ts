import { ASSUMPTIONS } from "@/lib/assumptions";
import { money, pct, years } from "@/lib/format";
import type {
  CostStack,
  Facts,
  Judgement,
  Operations,
  Scenario,
  Verdict,
} from "@/lib/types";

export function monthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number,
): number {
  const months = termYears * 12;
  if (principal <= 0 || months <= 0) return 0;
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return principal / months;
  const growth = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * growth) / (growth - 1);
}

export function remainingBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  monthsPaid: number,
): number {
  if (principal <= 0) return 0;
  const payment = monthlyPayment(principal, annualRate, termYears);
  const monthlyRate = annualRate / 12;
  if (monthlyRate === 0) return Math.max(0, principal - payment * monthsPaid);
  const growth = (1 + monthlyRate) ** monthsPaid;
  const balance = principal * growth - (payment * (growth - 1)) / monthlyRate;
  return Math.max(0, balance);
}

export function netPresentValue(rate: number, cashFlows: number[]): number {
  return cashFlows.reduce(
    (sum, cashFlow, year) => sum + cashFlow / (1 + rate) ** year,
    0,
  );
}

/** Solved internal rate of return. Polynomial roots are not an IRR. */
export function internalRateOfReturn(cashFlows: number[]): number | null {
  const hasPositive = cashFlows.some((cashFlow) => cashFlow > 0);
  const hasNegative = cashFlows.some((cashFlow) => cashFlow < 0);
  if (!hasPositive || !hasNegative) return null;

  const valueAt = (rate: number) => netPresentValue(rate, cashFlows);

  let rate = 0.12;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    let value = 0;
    let slope = 0;
    for (let year = 0; year < cashFlows.length; year += 1) {
      const discounted = cashFlows[year] / (1 + rate) ** year;
      value += discounted;
      if (year > 0) slope -= (year * discounted) / (1 + rate);
    }
    if (Math.abs(value) < 1e-6) return rate;
    if (!Number.isFinite(slope) || Math.abs(slope) < 1e-12) break;
    const next = rate - value / slope;
    if (!Number.isFinite(next) || next <= -0.95) break;
    if (Math.abs(next - rate) < 1e-8) return next;
    rate = next;
  }

  let low = -0.9;
  let high = 1.5;
  let lowValue = valueAt(low);
  let highValue = valueAt(high);
  if (lowValue === 0) return low;
  if (highValue === 0) return high;
  if (lowValue * highValue > 0) return null;

  for (let attempt = 0; attempt < 80; attempt += 1) {
    const mid = (low + high) / 2;
    const midValue = valueAt(mid);
    if (Math.abs(midValue) < 1e-4) return mid;
    if (lowValue * midValue <= 0) {
      high = mid;
      highValue = midValue;
    } else {
      low = mid;
      lowValue = midValue;
    }
  }
  return (low + high) / 2;
}

export function costStack(price: number, facts: Facts): CostStack {
  const notes: string[] = [];
  let remodeling = ASSUMPTIONS.remodelingCosts;
  let extra = ASSUMPTIONS.extraCosts;

  if (facts.sewer === "septic" && !facts.septicSixBedApproved) {
    extra += ASSUMPTIONS.septicExtra;
    notes.push(
      "Septic without a stated 6-bedroom approval adds $15,000. A full replacement in Thurston or Lewis County often runs past that allowance.",
    );
  }
  if (facts.garageSpaces < ASSUMPTIONS.minGarageSpaces) {
    remodeling += ASSUMPTIONS.garageShortfallExtra;
    notes.push(
      "Fewer than 2 garage spaces adds $30,000, because the 6-bed plan then needs an addition rather than a garage conversion.",
    );
  }

  const downPayment = price * ASSUMPTIONS.downPaymentPct;
  const holding = ASSUMPTIONS.holdingCosts6mo;
  return {
    downPayment,
    loanAmount: price - downPayment,
    remodeling,
    extra,
    holding,
    totalCashInvested: downPayment + remodeling + extra + holding,
    notes,
  };
}

export function operations(
  price: number,
  monthlyRent: number,
  loanAmount: number,
  hoaAnnual: number,
): Operations {
  const monthlyPrincipalInterest = monthlyPayment(
    loanAmount,
    ASSUMPTIONS.interestRate,
    ASSUMPTIONS.loanTermYears,
  );
  const monthlyTax = (price * ASSUMPTIONS.propertyTaxRate) / 12;
  const monthlyInsurance = ASSUMPTIONS.insuranceAnnual / 12;
  const monthlyHoa = Math.max(0, hoaAnnual) / 12;
  const monthlyOperating = monthlyRent * ASSUMPTIONS.operatingReservePct;
  const totalMonthlyOutflow =
    monthlyPrincipalInterest +
    monthlyTax +
    monthlyInsurance +
    monthlyHoa +
    monthlyOperating;
  const sixMonthCarry =
    (monthlyPrincipalInterest + monthlyTax + monthlyInsurance + monthlyHoa) * 6;

  return {
    monthlyPrincipalInterest,
    monthlyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyOperating,
    totalMonthlyOutflow,
    monthlyCashFlow: monthlyRent - totalMonthlyOutflow,
    annualCashFlow: (monthlyRent - totalMonthlyOutflow) * 12,
    sixMonthCarry,
    holdingGap: sixMonthCarry - ASSUMPTIONS.holdingCosts6mo,
  };
}

export function projection(
  price: number,
  monthlyRent: number,
  loanAmount: number,
  totalCashInvested: number,
  hoaAnnual: number,
): number[] {
  const flows = [-totalCashInvested];
  let rent = monthlyRent;
  let tax = (price * ASSUMPTIONS.propertyTaxRate) / 12;
  let insurance = ASSUMPTIONS.insuranceAnnual / 12;
  let hoa = Math.max(0, hoaAnnual) / 12;
  const principalAndInterest = monthlyPayment(
    loanAmount,
    ASSUMPTIONS.interestRate,
    ASSUMPTIONS.loanTermYears,
  );

  for (let year = 1; year <= ASSUMPTIONS.horizonYears; year += 1) {
    const reserve = rent * ASSUMPTIONS.operatingReservePct;
    const annual =
      (rent - (principalAndInterest + tax + insurance + hoa + reserve)) * 12;
    flows.push(annual);
    rent *= 1 + ASSUMPTIONS.rentGrowth;
    tax *= 1 + ASSUMPTIONS.expenseInflation;
    insurance *= 1 + ASSUMPTIONS.expenseInflation;
    hoa *= 1 + ASSUMPTIONS.expenseInflation;
  }

  const saleValue =
    price * (1 + ASSUMPTIONS.appreciation) ** ASSUMPTIONS.horizonYears;
  const balance = remainingBalance(
    loanAmount,
    ASSUMPTIONS.interestRate,
    ASSUMPTIONS.loanTermYears,
    ASSUMPTIONS.horizonYears * 12,
  );
  flows[flows.length - 1] += saleValue - balance;
  return flows;
}

function verdictFor(score: number): Verdict {
  if (score >= ASSUMPTIONS.alertScoreMin) return "Invest";
  if (score >= 5) return "Watch";
  return "Pass";
}

export function judge(
  facts: Facts,
  price: number,
  ops: Operations,
  roi: number,
): Judgement {
  const reasons: string[] = [];
  let score: number;

  if (ops.monthlyCashFlow < 500) {
    score = 2;
    reasons.push(
      "Monthly cash flow is under $500. That is too thin for a vacant month, a licensing hold, or a permit delay.",
    );
  } else if (ops.monthlyCashFlow < 1000) {
    score = 5;
    reasons.push(
      "Cash flow is positive and still under $1,000 a month, so one overrun consumes the cushion.",
    );
  } else if (roi >= 0.11 && ops.monthlyCashFlow >= 1800) {
    score = 10;
    reasons.push(
      "Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.",
    );
  } else if (roi >= 0.08 && ops.monthlyCashFlow >= 1000) {
    score = 8;
    reasons.push(
      "Return clears 8% with at least $1,000 a month of cash flow after the conversion budget.",
    );
  } else if (roi >= 0.05) {
    score = 6;
    reasons.push(
      "The lease covers the bills, and the payback is slow for the cash tied up in the down payment, remodel, and hold.",
    );
  } else {
    score = 4;
    reasons.push(
      "Cash-on-cash return is under 5% after the down payment and the conversion budget.",
    );
  }

  if (ops.monthlyCashFlow < 0) {
    reasons.push(
      "Any positive internal rate of return here is coming from the modeled year-10 sale, not from the lease.",
    );
  }

  if (facts.sewer === "septic" && !facts.septicSixBedApproved) {
    score = Math.min(score, 7);
    reasons.push(
      "Septic is not documented for 6 bedrooms. A 3-bedroom system is not a 6-resident Adult Family Home system.",
    );
  } else if (facts.sewer === "unknown") {
    score = Math.min(score, 8);
    reasons.push(
      "Sewer is unknown. Confirm public sewer, or a septic approval sized for 6 bedrooms, before treating this as a pass.",
    );
  }

  if (facts.garageSpaces < ASSUMPTIONS.minGarageSpaces) {
    score = Math.min(score, 6);
    reasons.push(
      "The $60,000 remodel assumes a 2-car garage with about 400 square feet of clear space.",
    );
  } else if (
    facts.garageSqft !== null &&
    facts.garageSqft < ASSUMPTIONS.minGarageSqft
  ) {
    score = Math.min(score, 8);
    reasons.push(
      `Garage area is listed at ${facts.garageSqft} sq ft, under the 400 sq ft planning minimum.`,
    );
  }

  if (facts.beds < ASSUMPTIONS.minBeds || facts.baths < ASSUMPTIONS.minBaths) {
    score = Math.min(score, 4);
    reasons.push(
      "The routine starts from a 3-bedroom, 2-bath house and adds bedrooms in the garage to reach 6 residents.",
    );
  }

  if (price < ASSUMPTIONS.priceMin || price > ASSUMPTIONS.priceMax) {
    score = Math.min(score, 7);
    reasons.push(
      `Price ${money(price)} sits outside the ${money(ASSUMPTIONS.priceMin)}–${money(ASSUMPTIONS.priceMax)} buy box.`,
    );
  }

  const outsideArea =
    facts.county === "other" ||
    facts.within30Miles === "no" ||
    (facts.county === "unknown" && facts.within30Miles !== "yes");
  if (outsideArea) {
    score = Math.min(score, 6);
    reasons.push(
      `The search area is ${ASSUMPTIONS.countiesLabel}, or within ${ASSUMPTIONS.hubRadiusMiles} miles of ${ASSUMPTIONS.hubLabel}.`,
    );
  }

  if (facts.ceilingClear === "no") {
    score = Math.min(score, 5);
    reasons.push(
      "The garage is marked as unable to finish near 7.5 feet of clearance. That is a conversion blocker until a builder says otherwise.",
    );
  } else if (facts.ceilingClear === "unknown") {
    score = Math.min(score, 8);
    reasons.push(
      "Finished garage ceiling height is not confirmed. The desk does not call a 10 while that WABO item is open.",
    );
  }

  if (facts.levelEntry === "no") {
    score = Math.min(score, 8);
    reasons.push(
      "No level entry is noted. A ramp or a grade change has to fit inside the remodel budget or the score should drop.",
    );
  }

  if (ops.holdingGap > 5000) {
    score = Math.min(score, 7);
    reasons.push(
      `Six-month mortgage, tax, insurance, and HOA is ${money(ops.sixMonthCarry)}, more than $5,000 over the $20,000 hold.`,
    );
  } else if (ops.holdingGap > 0) {
    reasons.push(
      `Six-month carry is ${money(ops.sixMonthCarry)}, just over the $20,000 hold.`,
    );
  } else {
    reasons.push(
      `Six-month carry is ${money(ops.sixMonthCarry)}, inside the $20,000 hold.`,
    );
  }

  reasons.push(
    `Evidence on this row: cash flow ${money(ops.monthlyCashFlow, 0)}/mo, ROI ${pct(roi, 1)}, cash in ${money(price * ASSUMPTIONS.downPaymentPct + costStack(price, facts).remodeling + costStack(price, facts).extra + ASSUMPTIONS.holdingCosts6mo)}.`,
  );

  return { score, verdict: verdictFor(score), reasons };
}

export function buildScenario(
  facts: Facts,
  purchasePrice: number,
  monthlyRent: number,
): Scenario {
  const stack = costStack(purchasePrice, facts);
  const ops = operations(
    purchasePrice,
    monthlyRent,
    stack.loanAmount,
    facts.hoaAnnual,
  );
  const cashFlows = projection(
    purchasePrice,
    monthlyRent,
    stack.loanAmount,
    stack.totalCashInvested,
    facts.hoaAnnual,
  );
  const roi =
    stack.totalCashInvested > 0
      ? ops.annualCashFlow / stack.totalCashInvested
      : 0;
  const paybackYears =
    ops.annualCashFlow > 0
      ? stack.totalCashInvested / ops.annualCashFlow
      : Number.POSITIVE_INFINITY;

  return {
    purchasePrice,
    monthlyRent,
    atListPrice: Math.round(purchasePrice) === Math.round(facts.listPrice),
    stack,
    ops,
    cashFlows,
    npv: netPresentValue(ASSUMPTIONS.discountRate, cashFlows),
    irr: internalRateOfReturn(cashFlows),
    paybackYears,
    roi,
    judgement: judge(facts, purchasePrice, ops, roi),
  };
}

export function indicatorText(scenario: Scenario): string {
  return [
    `Buy ${money(scenario.purchasePrice)} | Lease ${money(scenario.monthlyRent)}/mo`,
    `Cash flow: ${money(scenario.ops.monthlyCashFlow, 2)}/mo (${money(scenario.ops.annualCashFlow, 2)}/yr)`,
    `NPV: ${money(scenario.npv)}`,
    `IRR: ${scenario.irr === null ? "n/a" : pct(scenario.irr, 2)}`,
    `Payback: ${years(scenario.paybackYears)}`,
    `ROI: ${pct(scenario.roi, 2)}`,
  ].join("\n");
}

export function judgementText(scenario: Scenario): string {
  return [
    `${scenario.judgement.score}/10 · ${scenario.judgement.verdict}`,
    ...scenario.judgement.reasons,
  ].join("\n");
}
