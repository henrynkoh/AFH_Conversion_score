import { NextResponse } from "next/server";
import { saveSearchToDisk } from "@/lib/search-disk";
import {
  fetchCountyListings,
  listingsFromXml,
  maskNwmlsUser,
  readNwmlsCredentials,
  type NwmlsCounty,
} from "@/lib/nwmls";
import { runPackage } from "@/lib/report";
import { ASSUMPTIONS } from "@/lib/assumptions";

export const runtime = "nodejs";

const COUNTIES: NwmlsCounty[] = ["Thurston", "Lewis"];

export function GET() {
  const credentials = readNwmlsCredentials();
  return NextResponse.json({
    configured: Boolean(credentials),
    user: credentials ? maskNwmlsUser(credentials.user) : "",
  });
}

export async function POST() {
  const credentials = readNwmlsCredentials();
  if (!credentials) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "NWMLS is not connected. Add NWMLS_USER and NWMLS_PASSWORD to .env.local and restart the desk. Do not put that password in the repository or in a chat.",
      },
      { status: 400 },
    );
  }

  const end = new Date();
  const begin = new Date(end.getTime() - 21 * 24 * 60 * 60 * 1000);
  const houses: {
    address: string;
    mls: string;
    price: number;
    score: number;
    verdict: string;
    added: boolean;
  }[] = [];
  const errors: string[] = [];
  let checked = 0;

  for (const county of COUNTIES) {
    try {
      const xml = await fetchCountyListings(credentials, county, begin, end);
      const found = listingsFromXml(xml);
      checked += found.length;
      for (const facts of found) {
        if (facts.listPrice < ASSUMPTIONS.priceMin || facts.listPrice > ASSUMPTIONS.priceMax) continue;
        if (facts.beds < ASSUMPTIONS.minBeds || facts.baths < ASSUMPTIONS.minBaths) continue;
        const scored = runPackage(facts);
        if (!scored.ok) continue;
        const saved = saveSearchToDisk(scored.pack);
        houses.push({
          address: facts.address,
          mls: facts.mlsNumber,
          price: facts.listPrice,
          score: scored.pack.briefScenario.judgement.score,
          verdict: scored.pack.briefScenario.judgement.verdict,
          added: saved.added,
        });
        if (houses.length >= 40) break;
      }
    } catch (error) {
      errors.push(error instanceof Error ? error.message : `${county} could not be read.`);
    }
    if (houses.length >= 40) break;
  }

  return NextResponse.json({
    ok: errors.length === 0,
    checked,
    scored: houses.length,
    houses,
    errors,
  });
}
