# AFH Conversion Score

A desk routine for one search: houses in Thurston County, Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, Washington, that can start as a 3-bedroom, 2-bath home and become a 6-resident Adult Family Home by a garage conversion, then be leased to an operator.

Paste a Zillow link, another website link, a street address, or an NWMLS number. Add the Agent Full text when that is what you have. The desk builds a 5×5 buy box and ranks the top 5.

| Column | What it holds |
| --- | --- |
| Number | Rank |
| Name of indicators | Cash flow, NPV, IRR, payback, ROI |
| Overall judgement | 1–10, with the reason and the evidence |

A score of 8 or higher prepares an iPhone-sized brief. Lower scores stay on the desk. The brief is a preview. This app does not send text messages and does not store a mailbox password.

## Run

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

```bash
npm test
npm run lint
```

## The cash stack

Cash invested is not the whole purchase price. It is:

- 25% down
- $60,000 remodel ($30,000 more if the garage is under 2 spaces)
- $10,000 extra ($15,000 more if septic is not approved for 6 bedrooms)
- $20,000 six-month hold for mortgage, tax, insurance, and HOA

The planning rate is 6.75% on a 30-year loan. Tax is carried at 1.15%. Insurance is $2,200 a year. Operating reserve is 8% of the operator’s lease. Prices run from $450,000 to $550,000. Lease tests run from $3,500 to $6,000. Five steps each.

Principal and interest are a real amortization. IRR is solved from the cash flows. Earlier rough tables that used a flat mortgage factor will not match these numbers.

## What this app will not do

- Sign into NWMLS Matrix or bypass a login wall.
- Scrape Zillow.
- Call a desk screen a passed WABO inspection.
- Send a carrier text. T-Mobile’s public email-to-text gateway is retired, and secrets do not belong in this repo.

If an app password was pasted into a chat while this was being set up, revoke it in the Google Account security page.

## Read next

- [Quickstart](docs/QUICKSTART.md)
- [Manual](docs/MANUAL.md)
- [Tutorial](docs/TUTORIAL.md)

The same three documents are pages in the app, under Guides. Marketing copy for Facebook, Instagram, Threads, Blogger, Naver, Tistory, WordPress, a newsletter, and an email lives under Marketing.

## Deal book

Scores are stored in the browser and can be downloaded as CSV. They are not uploaded.
