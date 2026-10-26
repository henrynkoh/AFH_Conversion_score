import type { Metadata } from "next";
import Link from "next/link";
import { ScoreTable } from "@/components/score-table";
import { IphoneBrief } from "@/components/iphone-brief";
import { buttonVariants } from "@/components/ui/button";
import { money } from "@/lib/format";
import { runPackage } from "@/lib/report";
import { sampleFacts } from "@/lib/sample";
import { cn } from "cn";

export const metadata: Metadata = { title: "Tutorial" };

export default function TutorialPage() {
  const result = runPackage(sampleFacts());
  if (!result.ok) return null;
  const { pack } = result;

  return (
    <article className="mx-auto max-w-5xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Tutorial</p>
      <h1 className="mt-2 font-display text-4xl text-pine">
        Walk the sample rambler
      </h1>
      <div className="mt-4 max-w-3xl space-y-4 text-[15px] leading-7">
        <p>
          Sample Rambler SW is a worked example in Tumwater: {money(pack.facts.listPrice)},
          3 bedrooms, 2 baths, a 2-car garage, public sewer, level entry, and a
          confirmed ceiling. It is not a listing you can buy. Open Score a
          listing and click “Load worked example” to put the same house on the
          desk.
        </p>
        <p>
          Cash in at the list price is {money(pack.briefScenario.stack.totalCashInvested)}.
          That is 25% down plus $60,000, $10,000, and $20,000. The buy-box top
          row is a different, cheaper price. Read both tables. The phone brief
          uses the list price, not the cheapest cell in the grid.
        </p>
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ScoreTable
          rows={pack.topFive}
          title="Top 5 on the sample"
          note="These numbers come from the same engine as the score page. They will not match rough tables that used a mortgage factor instead of amortization."
        />
        <IphoneBrief
          brief={pack.phone}
          heartbeat={"Desk check\nSample only.\nNo text was sent."}
        />
      </div>
      <p className="mt-8">
        <Link href="/analyze" className={cn(buttonVariants({ size: "lg" }), "h-11 px-4")}>
          Open the score desk
        </Link>
      </p>
    </article>
  );
}
