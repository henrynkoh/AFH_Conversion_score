import type { County, Facts, ParsePatch, SourceType, Tri } from "@/lib/types";

export type ParseResult = {
  sourceType: SourceType;
  locked: boolean;
  notes: string[];
  patch: ParsePatch;
};

type CityHit = { county: County; within: Tri };

const CITIES: Record<string, CityHit> = {
  tumwater: { county: "thurston", within: "yes" },
  olympia: { county: "thurston", within: "yes" },
  lacey: { county: "thurston", within: "yes" },
  yelm: { county: "thurston", within: "yes" },
  tenino: { county: "thurston", within: "yes" },
  rainier: { county: "thurston", within: "yes" },
  bucoda: { county: "thurston", within: "yes" },
  rochester: { county: "thurston", within: "yes" },
  "grand mound": { county: "thurston", within: "yes" },
  centralia: { county: "lewis", within: "yes" },
  chehalis: { county: "lewis", within: "yes" },
  toledo: { county: "lewis", within: "yes" },
  winlock: { county: "lewis", within: "yes" },
  napavine: { county: "lewis", within: "yes" },
  mossyrock: { county: "lewis", within: "yes" },
  onalaska: { county: "lewis", within: "yes" },
  seattle: { county: "other", within: "no" },
  tacoma: { county: "other", within: "no" },
  bellevue: { county: "other", within: "no" },
};

function titledAddress(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/[_+]/g, " ")
    .split("-")
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstNumber(pattern: RegExp, text: string): number | undefined {
  const match = text.match(pattern);
  if (!match) return undefined;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : undefined;
}

function findPrice(text: string): number | undefined {
  const labeled = firstNumber(
    /(?:list\s*price|asking|price|lp)\s*[:\-]?\s*\$?\s*([0-9]{2,3}(?:,[0-9]{3})+|[0-9]{5,7})/i,
    text,
  );
  if (labeled && labeled >= 50_000) return labeled;
  const dollar = firstNumber(/\$\s*([0-9]{2,3}(?:,[0-9]{3})+|[0-9]{5,7})/, text);
  if (dollar && dollar >= 50_000) return dollar;
  return undefined;
}

function findCity(text: string): CityHit | undefined {
  const lower = text.toLowerCase();
  if (lower.includes("thurston county")) {
    return { county: "thurston", within: "yes" };
  }
  if (lower.includes("lewis county")) {
    return { county: "lewis", within: "yes" };
  }
  const keys = Object.keys(CITIES).sort((a, b) => b.length - a.length);
  for (const city of keys) {
    const pattern = new RegExp(`\\b${city.replace(" ", "\\s+")}\\b`, "i");
    if (pattern.test(lower)) return CITIES[city];
  }
  return undefined;
}

function findSewer(text: string): Facts["sewer"] | undefined {
  const deniesSeptic = /no septic|not on septic|septic\s*:\s*no/i.test(text);
  const publicSewer =
    /public sewer|city sewer|sewer connected|connected to (the )?public|sewer\s*:\s*public/i.test(
      text,
    );
  const septic = /\bseptic\b/i.test(text);
  if (publicSewer && (!septic || deniesSeptic)) return "public";
  if (septic && !deniesSeptic) return "septic";
  if (publicSewer) return "public";
  return undefined;
}

export function parseIntake(entry: string, listingText = ""): ParseResult {
  const rawEntry = entry.trim();
  const text = `${rawEntry}\n${listingText}`.replace(/\s+/g, " ").trim();
  const notes: string[] = [];
  const patch: ParsePatch = {};

  if (!text) {
    return { sourceType: "empty", locked: false, notes: ["Nothing was pasted."], patch };
  }

  let sourceType: SourceType = "manual";
  const lowerEntry = rawEntry.toLowerCase();

  if (lowerEntry.includes("matrix.nwmls.com") || lowerEntry.includes("nwmls.com")) {
    sourceType = "nwmls-link";
    notes.push(
      "This Matrix link stays behind your NWMLS login. The score does not sign in or bypass that session. Paste the Agent Full text, or type the price, beds, baths, garage, and sewer.",
    );
  } else if (/zillow\.com/i.test(rawEntry)) {
    sourceType = "zillow";
    const slug = rawEntry.match(/homedetails\/([^/?#]+)/i);
    if (slug) {
      patch.address = titledAddress(slug[1]);
      notes.push("Address read from the Zillow link. Confirm the price and the house facts. The page itself is not scraped.");
    } else {
      notes.push("Zillow link noted. The address was not in the URL, so type it or paste the listing text.");
    }
  } else if (/^https?:\/\//i.test(rawEntry)) {
    sourceType = "url";
    notes.push("Website link saved. This desk does not fetch the page. Paste the listing text or fill in the facts.");
  } else if (/(?:nwmls|mls)\s*#?\s*\d{5,10}/i.test(rawEntry) || /^\d{6,8}$/.test(rawEntry)) {
    sourceType = "nwmls-number";
  } else if (/\d/.test(rawEntry) && /[a-z]/i.test(rawEntry)) {
    sourceType = "address";
    patch.address = rawEntry.replace(/\s+/g, " ");
  }

  const mls = text.match(/(?:nwmls|mls)\s*#?\s*(\d{5,10})/i);
  if (mls) patch.mlsNumber = mls[1];
  if (sourceType === "nwmls-number" && !patch.mlsNumber && /^\d{6,8}$/.test(rawEntry)) {
    patch.mlsNumber = rawEntry;
  }

  const labeledAddress = listingText.match(
    /(?:address|prop(?:erty)? addr)\s*:\s*([^\n$]+)/i,
  );
  if (labeledAddress) {
    patch.address = labeledAddress[1].replace(/\s+/g, " ").trim().replace(/[|,]+$/, "");
  }

  const price = findPrice(text);
  if (price) patch.listPrice = price;

  const beds = firstNumber(/(?:bedrooms?|beds?)\s*[:\-]?\s*(\d+)/i, text)
    ?? firstNumber(/(\d+)\s*[-\s]?\s*beds?\b/i, text);
  const baths = firstNumber(/(?:bathrooms?|baths?)\s*[:\-]?\s*(\d+(?:\.\d+)?)/i, text)
    ?? firstNumber(/(\d+(?:\.\d+)?)\s*[-\s]?\s*baths?\b/i, text);
  if (beds !== undefined) patch.beds = beds;
  if (baths !== undefined) patch.baths = baths;

  const garage = firstNumber(
    /(?:garage(?:\s*\/\s*cov\.?\s*spaces)?|garage spaces|cov\.?\s*spaces)\s*[:\-]?\s*(\d+)/i,
    text,
  ) ?? firstNumber(/(\d+)\s*[-\s]?\s*car\b/i, text);
  if (garage !== undefined) patch.garageSpaces = garage;

  const sqft = firstNumber(
    /(?:living\s*(?:sq|area)|sq\.?\s*ft\.?|square feet|sqft)\s*[:\-]?\s*([0-9,]{3,7})/i,
    text,
  );
  if (sqft && sqft > 200 && sqft < 20000) patch.sqft = sqft;

  const sewer = findSewer(text);
  if (sewer) patch.sewer = sewer;
  if (/6\s*[- ]?\s*bed(room)?\s*(septic|system|approval)/i.test(text)) {
    patch.septicSixBedApproved = true;
  }

  const city = findCity(text);
  if (city) {
    patch.county = city.county;
    patch.within30Miles = city.within;
  }

  if (/\b(rambler|one[- ]story|single story|no[- ]step|level entry|level lot)\b/i.test(text)) {
    patch.levelEntry = "yes";
  }
  if (/\b(two[- ]story|stairs to (the )?main|daylight basement)\b/i.test(text)) {
    patch.levelEntry = "no";
  }

  if (listingText.trim()) {
    patch.remarks = listingText.trim().slice(0, 1200);
  }

  patch.sourceType = sourceType;
  patch.sourceRef = rawEntry;

  if (!patch.listPrice) {
    notes.push("No list price was found. Type it before scoring.");
  }
  if (!patch.address) {
    notes.push("No street address was found.");
  }

  return { sourceType, locked: sourceType === "nwmls-link", notes, patch };
}
