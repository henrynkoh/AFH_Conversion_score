export type County = "thurston" | "lewis" | "other" | "unknown";
export type Sewer = "public" | "septic" | "unknown";
export type Tri = "unknown" | "yes" | "no";
export type SourceType =
  | "zillow"
  | "nwmls-link"
  | "nwmls-number"
  | "url"
  | "address"
  | "manual"
  | "empty";

export type ParsePatch = Partial<Facts>;

export type Facts = {
  address: string;
  listPrice: number;
  beds: number;
  baths: number;
  garageSpaces: number;
  garageSqft: number | null;
  sewer: Sewer;
  septicSixBedApproved: boolean;
  sqft: number | null;
  hoaAnnual: number;
  county: County;
  within30Miles: Tri;
  levelEntry: Tri;
  ceilingClear: Tri;
  remarks: string;
  sourceType: SourceType;
  sourceRef: string;
  mlsNumber: string;
};

export type Verdict = "Invest" | "Watch" | "Pass";

export type Judgement = {
  score: number;
  verdict: Verdict;
  reasons: string[];
};

export type CostStack = {
  downPayment: number;
  loanAmount: number;
  remodeling: number;
  extra: number;
  holding: number;
  totalCashInvested: number;
  notes: string[];
};

export type Operations = {
  monthlyPrincipalInterest: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyOperating: number;
  totalMonthlyOutflow: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  sixMonthCarry: number;
  holdingGap: number;
};

export type Scenario = {
  purchasePrice: number;
  monthlyRent: number;
  atListPrice: boolean;
  stack: CostStack;
  ops: Operations;
  cashFlows: number[];
  npv: number;
  irr: number | null;
  paybackYears: number;
  roi: number;
  judgement: Judgement;
};

export type CheckStatus = "pass" | "watch" | "fail" | "unknown";

export type CheckItem = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

export type PhoneBrief = {
  send: boolean;
  headline: string;
  body: string;
};

export type ScorePackage = {
  facts: Facts;
  prices: number[];
  rents: number[];
  grid: Scenario[];
  topFive: Scenario[];
  atListPrice: Scenario[];
  briefScenario: Scenario;
  phone: PhoneBrief;
  checklist: CheckItem[];
};

export type ArchiveRow = {
  id: string;
  savedAt: string;
  address: string;
  sourceRef: string;
  listPrice: number;
  lease: number;
  monthlyCashFlow: number;
  npv: number;
  irr: number | null;
  paybackYears: number;
  roi: number;
  score: number;
  verdict: Verdict;
  sewer: Sewer;
  garageSpaces: number;
  county: County;
  phoneBody: string;
};
