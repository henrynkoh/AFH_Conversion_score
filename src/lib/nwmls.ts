import { blankFacts } from "@/lib/report";
import { parseIntake } from "@/lib/parse-listing";
import type { Facts } from "@/lib/types";

const ENDPOINT = "https://evernet.nwmls.com/evernetqueryservice/evernetquery.asmx";
const SOAP_ACTION = "http://www.nwmls.com/EverNetServices/RetrieveListingData";

export type NwmlsCounty = "Thurston" | "Lewis";

export type NwmlsCredentials = {
  user: string;
  password: string;
};

export function readNwmlsCredentials(env: NodeJS.ProcessEnv = process.env): NwmlsCredentials | null {
  const user = env.NWMLS_USER?.trim() ?? "";
  const password = env.NWMLS_PASSWORD ?? "";
  if (!user || !password.trim()) return null;
  return { user, password };
}

export function maskNwmlsUser(user: string): string {
  const trimmed = user.trim();
  if (trimmed.length <= 2) return "••";
  return `${trimmed.slice(0, 2)}${"•".repeat(Math.min(8, trimmed.length - 2))}`;
}

export function listingQueryXml(input: {
  user: string;
  password: string;
  county: NwmlsCounty;
  begin: Date;
  end: Date;
}): string {
  return [
    `<?xml version="1.0" encoding="utf-8" standalone="no"?>`,
    `<EverNetQuerySpecification xmlns="urn:www.nwmls.com/Schemas/General/EverNetQueryXML.xsd">`,
    `<Message><Head>`,
    `<UserId>${xmlEscape(input.user)}</UserId>`,
    `<Password>${xmlEscape(input.password)}</Password>`,
    `<SchemaName>StandardXML1_3</SchemaName>`,
    `</Head><Body><Query>`,
    `<MLS>NWMLS</MLS>`,
    `<PropertyType>RESI</PropertyType>`,
    `<Status>A</Status>`,
    `<County>${input.county}</County>`,
    `<BeginDate>${evernetDate(input.begin)}</BeginDate>`,
    `<EndDate>${evernetDate(input.end)}</EndDate>`,
    `</Query><Filter></Filter></Body></Message></EverNetQuerySpecification>`,
  ].join("");
}

export function soapEnvelope(queryXml: string): string {
  return [
    `<?xml version="1.0" encoding="utf-8"?>`,
    `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">`,
    `<soap:Body>`,
    `<RetrieveListingData xmlns="http://www.nwmls.com/EverNetServices">`,
    `<v_strXmlQuery>${xmlEscape(queryXml)}</v_strXmlQuery>`,
    `</RetrieveListingData>`,
    `</soap:Body></soap:Envelope>`,
  ].join("");
}

export function redactSecrets(text: string, credentials: NwmlsCredentials): string {
  let clean = text;
  if (credentials.password) clean = clean.split(credentials.password).join("••••");
  return clean.slice(0, 500);
}

export async function fetchCountyListings(
  credentials: NwmlsCredentials,
  county: NwmlsCounty,
  begin: Date,
  end: Date,
): Promise<string> {
  const query = listingQueryXml({ ...credentials, county, begin, end });
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: `"${SOAP_ACTION}"`,
    },
    body: soapEnvelope(query),
    signal: AbortSignal.timeout(25_000),
  });
  const raw = await response.text();
  const fault = raw.match(/<faultstring[^>]*>([\s\S]*?)<\/faultstring>/i)?.[1];
  if (!response.ok || fault) {
    throw new Error(
      redactSecrets(decodeXml(fault || `NWMLS returned HTTP ${response.status}.`), credentials),
    );
  }
  const result = raw.match(/<RetrieveListingDataResult[^>]*>([\s\S]*?)<\/RetrieveListingDataResult>/i)?.[1] ?? raw;
  return decodeXml(result);
}

export function listingsFromXml(xml: string): Facts[] {
  const blocks = xml.match(/<(?:\w+:)?Residential\b[^>]*>[\s\S]*?<\/(?:\w+:)?Residential>/gi) ?? [];
  const houses: Facts[] = [];
  for (const block of blocks) {
    const facts = residentialToFacts(block);
    if (facts) houses.push(facts);
  }
  return houses;
}

export function residentialToFacts(block: string): Facts | null {
  const street = tag(block, ["ST", "Street", "Address", "StreetAddress", "LNA"]);
  const city = tag(block, ["CIT", "City"]);
  const price = numberTag(block, ["LP", "ListPrice", "Price"]);
  const beds = numberTag(block, ["BR", "Bedrooms", "Beds"]);
  const baths = numberTag(block, ["BTH", "Baths", "Bathrooms", "BathroomsFull"]);
  const garage = numberTag(block, ["GAR", "Garage", "GarageSpaces", "CoveredSpaces"]);
  const sqft = numberTag(block, ["ASF", "SqFt", "SquareFootage", "LivingArea"]);
  const mls = tag(block, ["LN", "ListingNumber", "MLSNumber"]);
  const sewer = tag(block, ["SWR", "Sewer", "SewerType", "WaterSewer"]);
  const remarks = tag(block, ["MR", "Remarks", "MarketingRemarks", "PublicRemarks"]);
  const countyName = tag(block, ["COUNTY", "County", "COU"]);
  if (!street || !price) return null;

  const sheet = [
    `Address: ${street}${city ? `, ${city} WA` : ""}`,
    `List Price: $${price}`,
    beds === null ? "" : `Bedrooms: ${beds}`,
    baths === null ? "" : `Bathrooms: ${baths}`,
    garage === null ? "" : `Garage Spaces: ${garage}`,
    sqft ? `Sq Ft: ${sqft}` : "",
    sewer ? `Sewer: ${sewer}` : "",
    countyName ? `${countyName} County` : "",
    mls ? `NWMLS ${mls}` : "",
    remarks,
  ]
    .filter(Boolean)
    .join("\n");

  const parsed = parseIntake(mls ? `NWMLS ${mls}` : street, sheet);
  const facts: Facts = {
    ...blankFacts(),
    ...parsed.patch,
    beds: parsed.patch.beds ?? (beds ?? 0),
    baths: parsed.patch.baths ?? (baths ?? 0),
    garageSpaces: parsed.patch.garageSpaces ?? (garage ?? 0),
    garageSqft: null,
    sewer: parsed.patch.sewer ?? "unknown",
    ceilingClear: "unknown",
    levelEntry: parsed.patch.levelEntry ?? "unknown",
    sourceType: "nwmls-number",
    sourceRef: mls ? `NWMLS ${mls}` : street,
    mlsNumber: parsed.patch.mlsNumber || mls,
    remarks: remarks.slice(0, 1200),
  };
  return facts;
}

function tag(block: string, names: string[]): string {
  for (const name of names) {
    const match = block.match(new RegExp(`<(?:\\w+:)?${name}\\b[^>]*>([\\s\\S]*?)</(?:\\w+:)?${name}>`, "i"));
    if (!match) continue;
    const value = decodeXml(match[1]).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
    if (value) return value;
  }
  return "";
}

function numberTag(block: string, names: string[]): number | null {
  const raw = tag(block, names).replace(/[$,]/g, "");
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function evernetDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
