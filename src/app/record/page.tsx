import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Analyzer } from "@/components/analyzer";
import { SearchLedger } from "@/components/search-ledger";
import { CHANNELS } from "@/lib/marketing";
import AssumptionsPage from "../assumptions/page";
import GuidePage from "../guide/page";
import ManualPage from "../guide/manual/page";
import QuickstartPage from "../guide/quickstart/page";
import TutorialPage from "../guide/tutorial/page";
import MarketingPage from "../marketing/page";
import MethodPage from "../method/page";

export const metadata: Metadata = { title: "Project record" };

const CHAPTERS = [
  { href: "#quickstart", label: "Quickstart" },
  { href: "#manual", label: "Manual" },
  { href: "#method", label: "Six Sigma routine" },
  { href: "#assumptions", label: "Assumptions" },
  { href: "#guides", label: "Guide index" },
  { href: "#tutorial", label: "Worked example" },
  { href: "#marketing", label: "Every channel" },
  { href: "#searches", label: "Searches added later" },
  { href: "#score", label: "Score the next house" },
];

export default function RecordPage() {
  return (
    <main>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-xs tracking-[0.18em] text-[#c62828] uppercase">
            One document · start to finish
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] text-pine">
            The full project record
          </h1>
          <p className="mt-5 text-lg leading-8">
            Every page of AFH Conversion Score is in this scroll: how to run it,
            how a listing becomes a score, the rates, the worked Tumwater example,
            and the words for each channel. Houses you score after this are added
            at the end, in this browser, under the searches chapter.
          </p>
          <ol className="mt-8 grid gap-2 sm:grid-cols-2">
            {CHAPTERS.map((chapter, index) => (
              <li key={chapter.href}>
                <Link
                  href={chapter.href}
                  className="flex gap-3 rounded-xl border border-border bg-card px-3 py-3 text-sm hover:border-[#c62828]"
                >
                  <span className="font-mono text-[#c62828]">{index + 1}</span>
                  <span>{chapter.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <Chapter id="quickstart" number="1" title="Quickstart">
        <QuickstartPage />
      </Chapter>
      <Chapter id="manual" number="2" title="Manual">
        <ManualPage />
      </Chapter>
      <Chapter id="method" number="3" title="Six Sigma routine">
        <MethodPage />
      </Chapter>
      <Chapter id="assumptions" number="4" title="Assumptions">
        <AssumptionsPage />
      </Chapter>
      <Chapter id="guides" number="5" title="Guide index">
        <GuidePage />
      </Chapter>
      <Chapter id="tutorial" number="6" title="Worked example">
        <TutorialPage />
      </Chapter>
      <Chapter id="marketing" number="7" title="Every channel">
        <MarketingPage />
        <div className="mx-auto max-w-3xl space-y-10 px-4 pb-12">
          {CHANNELS.map((channel) => (
            <article key={channel.slug} id={channel.slug} className="border-t border-border pt-8">
              <p className="text-xs tracking-[0.16em] text-copper uppercase">
                {channel.kind} · {channel.place}
              </p>
              <h2 className="mt-2 font-display text-3xl text-pine">{channel.name}</h2>
              <h3 className="mt-4 text-xl leading-snug">{channel.title}</h3>
              <div className="mt-4 rounded-xl border border-border bg-card px-5 py-5 whitespace-pre-wrap text-[15px] leading-7">
                {channel.body}
              </div>
            </article>
          ))}
        </div>
      </Chapter>
      <Chapter id="searches" number="8" title="Searches added later">
        <SearchLedger />
      </Chapter>
      <Chapter id="score" number="9" title="Score the next house">
        <div className="mx-auto max-w-3xl px-4 pt-10">
          <p className="text-[15px] leading-7">
            This is the same score desk. A package you build here is written into
            the searches chapter above and into the deal book.
          </p>
        </div>
        <Analyzer />
      </Chapter>
    </main>
  );
}

function Chapter({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border">
      <div className="bg-[#f7efe6]">
        <div className="mx-auto flex max-w-3xl items-baseline gap-3 px-4 py-4">
          <span className="font-mono text-sm text-[#c62828]">{number}</span>
          <h2 className="font-display text-lg text-pine">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}
