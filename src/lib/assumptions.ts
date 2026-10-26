/**
 * Desk assumptions for a Thurston / Lewis Adult Family Home conversion.
 * These are planning inputs for a repeatable screen, not a lender quote,
 * a tax bill, or a WABO approval.
 */
export const ASSUMPTIONS = {
  asOfLabel: "October 2026 desk screen",
  downPaymentPct: 0.25,
  interestRate: 0.0675,
  loanTermYears: 30,
  propertyTaxRate: 0.0115,
  insuranceAnnual: 2200,
  remodelingCosts: 60_000,
  extraCosts: 10_000,
  septicExtra: 15_000,
  garageShortfallExtra: 30_000,
  holdingCosts6mo: 20_000,
  operatingReservePct: 0.08,
  rentGrowth: 0.025,
  expenseInflation: 0.02,
  appreciation: 0.03,
  discountRate: 0.085,
  horizonYears: 10,
  priceMin: 450_000,
  priceMax: 550_000,
  rentMin: 3_500,
  rentMax: 6_000,
  scenarioCount: 5,
  alertScoreMin: 8,
  minGarageSpaces: 2,
  minGarageSqft: 400,
  minBeds: 3,
  minBaths: 2,
  targetResidents: 6,
  hubLabel: "3571 Cassie Drive SW, Tumwater, WA",
  hubRadiusMiles: 30,
  countiesLabel: "Thurston and Lewis counties",
} as const;

export const ASSUMPTION_ROWS: { name: string; value: string; why: string }[] = [
  {
    name: "Down payment",
    value: "25%",
    why: "Cash actually left in the deal. The loan covers the rest of the purchase price.",
  },
  {
    name: "Interest",
    value: "6.75% fixed, 30 years",
    why: "Planning rate for an investment mortgage. It is not a lock from a lender.",
  },
  {
    name: "Property tax",
    value: "1.15% of price per year",
    why: "Blended planning rate for Thurston and Lewis. The county bill will differ.",
  },
  {
    name: "Insurance",
    value: "$2,200 a year",
    why: "Allowance for a house leased to a 6-resident Adult Family Home, above a plain homeowner policy.",
  },
  {
    name: "HOA",
    value: "$0 unless you enter one",
    why: "Most garage-conversion candidates are houses without an HOA. A fee you type in is carried in the hold and the monthly cost.",
  },
  {
    name: "Remodel",
    value: "$60,000",
    why: "Garage conversion plus the access work that fits a straightforward 2-car garage. A 1-car or no garage adds $30,000.",
  },
  {
    name: "Extra",
    value: "$10,000",
    why: "Permits, inspection fees, and small surprises. Septic without a 6-bedroom approval adds $15,000, and a real replacement can cost more than that.",
  },
  {
    name: "Six-month hold",
    value: "$20,000 cap",
    why: "Mortgage, tax, insurance, and HOA while the conversion and licensing sit still. The screen also computes the actual six-month carry and flags a cap miss.",
  },
  {
    name: "Operating reserve",
    value: "8% of lease rent",
    why: "Maintenance and vacancy on a long-term lease to an operator. This is not the resident rate.",
  },
  {
    name: "Lease growth",
    value: "2.5% a year",
    why: "Rent steps up each year of the 10-year model. Principal and interest stay flat.",
  },
  {
    name: "Expense inflation",
    value: "2% a year",
    why: "Tax, insurance, and HOA rise. The mortgage payment does not.",
  },
  {
    name: "Appreciation",
    value: "3% a year",
    why: "Used only for the year-10 sale value. Selling costs are not deducted, so the sale equity is optimistic.",
  },
  {
    name: "Hurdle rate",
    value: "8.5%",
    why: "Discount rate for net present value over 10 years.",
  },
  {
    name: "Buy box",
    value: "$450,000 to $550,000",
    why: "Five prices, evenly spaced. A list price outside the box is still scored and marked.",
  },
  {
    name: "Lease tests",
    value: "$3,500 to $6,000",
    why: "Five monthly leases, evenly spaced. The top of the range is a test, not a signed rent.",
  },
  {
    name: "Send line",
    value: "8 out of 10",
    why: "The phone brief is marked ready only at 8 or above. Lower scores stay on the desk.",
  },
];
