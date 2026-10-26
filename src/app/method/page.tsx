import type { Metadata } from "next";
import { Doc } from "@/components/doc";

export const metadata: Metadata = { title: "Six Sigma routine" };

export default function MethodPage() {
  return (
    <Doc
      eyebrow="DMAIC"
      title="The routine, named like a factory problem"
      lede="Six Sigma is the habit of defining a defect, measuring it, and refusing to ship a pass that the evidence does not support. Here the defect is a house that looks like an Adult Family Home conversion and is not one."
    >
      <h2>Define</h2>
      <p>
        The customer of this desk is one search: houses in Thurston County, Lewis
        County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, that can
        start as a 3-bedroom, 2-bath home and become a 6-resident Adult Family
        Home by a garage conversion, then be leased to an operator.
      </p>
      <p>
        A defect is a recommended “Invest” that is missing a price, a sewer
        answer, a garage, or a cash-flow cushion. A text that says the garage
        passed WABO is also a defect. This desk does not inspect buildings.
      </p>
      <h2>Measure</h2>
      <p>
        Every listing is measured the same way. List price. Five lease tests
        from $3,500 to $6,000. Beds, baths, garage spaces, garage area when you
        have it, sewer, county, and whether you place it inside the 30-mile
        radius. The cash stack is fixed: 25% down, $60,000 remodel, $10,000
        extra, $20,000 hold.
      </p>
      <h2>Analyze</h2>
      <p>
        Twenty-five cells cover the buy box. Five more cover the actual list
        price, because a $495,000 house is not a $450,000 house. Each cell
        reports monthly cash flow, 10-year NPV at 8.5%, a solved IRR, simple
        payback, and cash-on-cash ROI. The top five are sorted by score, then
        ROI, then cash flow.
      </p>
      <h2>Improve</h2>
      <p>
        Earlier drafts of this screen used a flat mortgage factor and treated
        polynomial roots as an internal rate of return. Those shortcuts do not
        match the formulas, so the sample tables from that drafting do not match
        this app. Principal and interest are amortized. The mortgage payment
        does not inflate. Tax, insurance, and HOA do. Septic without a
        6-bedroom approval and a missing second garage bay change the cash in
        before the score is allowed to look good.
      </p>
      <h2>Control</h2>
      <ul>
        <li>No list price, no score.</li>
        <li>Unknown ceiling height cannot be a 10.</li>
        <li>The phone brief is prepared only at 8 or above, and it says “desk screen.”</li>
        <li>The deal book is local. A morning carrier text is not pretended.</li>
        <li>Matrix links are not opened. The login stays yours.</li>
      </ul>
    </Doc>
  );
}
