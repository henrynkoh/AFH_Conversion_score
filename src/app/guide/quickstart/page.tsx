import type { Metadata } from "next";
import { Doc } from "@/components/doc";

export const metadata: Metadata = { title: "Quickstart" };

export default function QuickstartPage() {
  return (
    <Doc
      eyebrow="Quickstart"
      title="Score the first house today"
      lede="You need Node.js 22 and a listing, or the worked example that ships with the desk."
    >
      <h2>Run it</h2>
      <ol>
        <li>Install dependencies with <code>npm install</code>.</li>
        <li>Start the desk with <code>npm run dev</code>. It listens on port 3847.</li>
        <li>Open Score a listing.</li>
        <li>Click “Load worked example” if you do not have a listing in front of you.</li>
        <li>Or paste a Zillow link, an address, an NWMLS number, or Agent Full text, then click “Build the score package.”</li>
      </ol>
      <h2>What you should see</h2>
      <p>
        A cash-in strip, a conversion checklist, the top 5 buy-box rows, five
        leases at the list price, the 25-cell score grid, and an iPhone 13 Pro
        Max preview. The preview is the message. This server does not send it.
      </p>
      <h2>Tests</h2>
      <p>
        <code>npm test</code> checks the mortgage payment, the IRR solver, the
        buy-box grid, the septic penalty, and the listing parser.
      </p>
      <h2>What this will not do on the first run</h2>
      <ul>
        <li>It will not sign into NWMLS Matrix.</li>
        <li>It will not scrape Zillow.</li>
        <li>It will not text 415-767-8875. Copy the brief if you want it on the phone.</li>
      </ul>
    </Doc>
  );
}
