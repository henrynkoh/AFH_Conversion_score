# Quickstart

## Run

```bash
npm install
npm run dev
```

The desk listens on port 3847. Open http://127.0.0.1:3847 and choose **Score a listing**.

## First score

1. Click **Load worked example** if you do not have a listing open.
2. Or paste a Zillow link, a street address, an NWMLS number, or a Matrix link.
3. If the link is a Matrix session, paste the Agent Full text in the second box and click **Read into the form**.
4. Confirm beds, baths, garage, sewer, county, and the Tumwater radius.
5. Click **Build the score package**.

You should see the cash-in strip, the conversion checklist, the top 5 table, five leases at the list price, the 25-cell grid, and an iPhone 13 Pro Max preview.

## Checks

```bash
npm test
```

The tests cover amortization, the IRR solver, the 5×5 grid, the septic and garage penalties, and the parser.

## Not on the first run

The app does not sign into NWMLS, does not scrape Zillow, and does not text a phone. Copy the brief from the preview or the deal book if you want it on the iPhone.
