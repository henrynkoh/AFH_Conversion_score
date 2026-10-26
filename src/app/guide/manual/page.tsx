import type { Metadata } from "next";
import { Doc } from "@/components/doc";

export const metadata: Metadata = { title: "Manual" };

export default function ManualPage() {
  return (
    <Doc
      eyebrow="Manual"
      title="How a listing becomes a score"
      lede="The same inputs, the same cash stack, the same table. That is the whole system."
    >
      <h2>Entry</h2>
      <p>Four kinds of entry are accepted, and they can be combined with pasted listing text.</p>
      <ul>
        <li>Zillow link. The street name is read from the homedetails slug. The listing page is not fetched.</li>
        <li>Any other website link. Saved as a source. Facts still have to be typed or pasted.</li>
        <li>Street address. City names such as Tumwater, Olympia, Lacey, Centralia, and Chehalis set the county screen.</li>
        <li>NWMLS number, or a Matrix results link. The link is recognized and left locked. Paste the Agent Full text for price, beds, sewer, and garage.</li>
      </ul>
      <h2>Cash invested</h2>
      <p>
        Cash in is the down payment, not the whole purchase price. The loan
        covers the rest. Down payment is 25% of the price used on that row.
        Remodel starts at $60,000 and gains $30,000 when the garage is under 2
        spaces. Extra starts at $10,000 and gains $15,000 when sewer is septic
        and a 6-bedroom approval is not checked. Holding cost is the $20,000
        cap, every time. The monthly model also computes six months of principal,
        interest, tax, insurance, and HOA so you can see when the cap is a
        fiction.
      </p>
      <h2>Monthly cash flow</h2>
      <p>
        Lease minus principal and interest, minus tax at 1.15% of price, minus
        $2,200 of insurance, minus HOA, minus 8% of the lease. The lease is what
        an operator would pay you. It is not the rate charged to a resident.
      </p>
      <h2>Ten-year indicators</h2>
      <p>
        NPV discounts the cash flows at 8.5%. Rent grows 2.5% a year. Tax,
        insurance, and HOA grow 2%. The mortgage payment stays flat. In year 10
        the model adds sale value at 3% appreciation minus the remaining loan
        balance. Selling costs are not deducted, so NPV and IRR are optimistic
        on the sale. ROI is year-1 cash flow divided by cash invested. Payback
        is cash invested divided by that same year-1 cash flow.
      </p>
      <h2>The 1 to 10 scale</h2>
      <ul>
        <li>10 — ROI at least 11% and cash flow at least $1,800 a month, and no open defect pulls it down.</li>
        <li>8 — ROI at least 8% and cash flow at least $1,000. This is the send line.</li>
        <li>7 — Often a septic caution or a price outside the buy box.</li>
        <li>6 — Slow payback, thin geography, or a one-car garage.</li>
        <li>5 and below — Cash flow under $1,000, or the house is the wrong starting layout.</li>
        <li>2 — Cash flow under $500.</li>
      </ul>
      <p>
        Unknown finished ceiling height caps the score at 8. A ceiling marked
        “no” caps it at 5. The words on an 8 or a 10 still say desk screen, not
        inspection passed.
      </p>
      <h2>Deal book</h2>
      <p>
        Each build writes one row into this browser. Download the CSV from the
        deal book. Clearing it deletes only that local copy.
      </p>
    </Doc>
  );
}
