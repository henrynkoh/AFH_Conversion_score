import { NextResponse } from "next/server";
import { saveSearchToDisk } from "@/lib/search-disk";
import type { ScorePackage } from "@/lib/types";

export async function POST(request: Request) {
  let pack: ScorePackage;
  try {
    pack = (await request.json()) as ScorePackage;
  } catch {
    return NextResponse.json({ ok: false, error: "The score package was not readable." }, { status: 400 });
  }

  if (!pack?.facts || typeof pack.facts.address !== "string" || !pack.briefScenario) {
    return NextResponse.json({ ok: false, error: "A score package needs a house and a brief." }, { status: 400 });
  }

  const result = saveSearchToDisk(pack);
  return NextResponse.json({ ok: true, ...result });
}
