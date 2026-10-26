# AFH Conversion Score — full project record

This is the complete written record of the desk, from the first run through every channel. The red button on the repository home page opens this file. In the running app, the red **Full project record** button on the first page opens the same material as one scroll, then keeps adding each house you score.

The sample numbers below come from the same engine as the score page. Sample Rambler SW is not a listing you can buy.

Cash in at the list price is $213,750. The phone brief uses the list price at $6,000 a month: cash flow $2,454/mo, ROI 13.8%, IRR 18.7%, payback 7.3 years, score 10/10.

---

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


---

# Manual

AFH Conversion Score repeats one screen. The house changes. The sheet does not.

## Entry modes

- **Zillow link.** The address is read from a `/homedetails/` slug. The page is not fetched.
- **Other website link.** Saved as the source. Type or paste the facts.
- **Street address.** City names in the Tumwater region set Thurston or Lewis as a screen, not as a surveyed 30-mile radius.
- **NWMLS number or Matrix link.** The number is kept. A Matrix link is marked locked. Paste Agent Full text for price, beds, baths, garage, and sewer. The app does not log in.

## Cash invested

| Piece | Amount |
| --- | --- |
| Down payment | 25% of the price on that row |
| Remodel | $60,000, plus $30,000 under 2 garage spaces |
| Extra | $10,000, plus $15,000 for septic without a 6-bedroom approval |
| Hold | $20,000 cap for six months of mortgage, tax, insurance, and HOA |

The loan is the other 75%, amortized at 6.75% for 30 years.

## Monthly cash flow

Operator lease, minus principal and interest, minus tax at 1.15% of price, minus $2,200 insurance per year, minus HOA, minus 8% of the lease.

The lease is not the rate charged to a resident.

## Ten-year model

- NPV uses an 8.5% discount rate.
- Rent grows 2.5% a year.
- Tax, insurance, and HOA grow 2%. The mortgage payment does not.
- Year 10 adds sale value at 3% appreciation minus the remaining balance.
- Selling costs are not deducted, so the sale piece of NPV and IRR is optimistic.
- ROI is year-1 cash flow divided by cash invested.
- Payback uses that same year-1 cash flow.

## Judgement

| Score | Meaning |
| --- | --- |
| 10 | ROI at least 11% and cash flow at least $1,800, with no open defect |
| 8 | ROI at least 8% and cash flow at least $1,000. This is the send line |
| 7 | Often septic caution, or a price outside $450,000–$550,000 |
| 6 | Slow payback, outside the search area, or a one-car garage |
| 5 and below | Thin cash flow or the wrong starting layout |
| 2 | Cash flow under $500 |

An unconfirmed garage ceiling caps the score at 8. A ceiling marked “no” caps it at 5. The phone brief never says the inspection passed.

## Deal book

Building a score writes a row in this browser. Download CSV from the deal book. Clear deletes only that local copy.

## Geography

Thurston County, Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, WA.


---

# Six Sigma routine

The defect is a house that looks like an Adult Family Home conversion and is not one.

## Define

The search is houses in Thurston County, Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, that can start as a 3-bedroom, 2-bath home and become a 6-resident Adult Family Home by a garage conversion, then be leased to an operator.

A recommended Invest that is missing a price, a sewer answer, a garage, or a cash-flow cushion is a defect. A text that says the garage passed WABO is also a defect. This desk does not inspect buildings.

## Measure

List price. Five lease tests from $3,500 to $6,000. Beds, baths, garage spaces, garage area when you have it, sewer, county, and the 30-mile radius. Cash stack: 25% down, $60,000 remodel, $10,000 extra, $20,000 hold.

## Analyze

Twenty-five cells cover the buy box. Five more cover the actual list price. Each cell reports monthly cash flow, 10-year NPV at 8.5%, a solved IRR, simple payback, and cash-on-cash ROI. The top five are sorted by score, then ROI, then cash flow.

## Improve

Principal and interest are amortized. The mortgage payment does not inflate. Tax, insurance, and HOA do. Septic without a 6-bedroom approval and a missing second garage bay change the cash in before the score is allowed to look good.

## Control

- No list price, no score.
- Unknown ceiling height cannot be a 10.
- The phone brief is prepared only at 8 or above, and it says desk screen.
- The deal book is local. A morning carrier text is not sent.
- Matrix links are not opened.

---

# Assumptions

October 2026 desk screen. Change the house. Do not change the sheet unless the desk changes the sheet on purpose.

| Input | Value | Why it is here |
| --- | --- | --- |
| Down payment | 25% | Cash actually left in the deal. The loan covers the rest of the purchase price. |
| Interest | 6.75% fixed, 30 years | Planning rate for an investment mortgage. It is not a lock from a lender. |
| Property tax | 1.15% of price per year | Blended planning rate for Thurston and Lewis. The county bill will differ. |
| Insurance | $2,200 a year | Allowance for a house leased to a 6-resident Adult Family Home, above a plain homeowner policy. |
| HOA | $0 unless you enter one | Most garage-conversion candidates are houses without an HOA. A fee you type in is carried in the hold and the monthly cost. |
| Remodel | $60,000 | Garage conversion plus the access work that fits a straightforward 2-car garage. A 1-car or no garage adds $30,000. |
| Extra | $10,000 | Permits, inspection fees, and small surprises. Septic without a 6-bedroom approval adds $15,000, and a real replacement can cost more than that. |
| Six-month hold | $20,000 cap | Mortgage, tax, insurance, and HOA while the conversion and licensing sit still. The screen also computes the actual six-month carry and flags a cap miss. |
| Operating reserve | 8% of lease rent | Maintenance and vacancy on a long-term lease to an operator. This is not the resident rate. |
| Lease growth | 2.5% a year | Rent steps up each year of the 10-year model. Principal and interest stay flat. |
| Expense inflation | 2% a year | Tax, insurance, and HOA rise. The mortgage payment does not. |
| Appreciation | 3% a year | Used only for the year-10 sale value. Selling costs are not deducted, so the sale equity is optimistic. |
| Hurdle rate | 8.5% | Discount rate for net present value over 10 years. |
| Buy box | $450,000 to $550,000 | Five prices, evenly spaced. A list price outside the box is still scored and marked. |
| Lease tests | $3,500 to $6,000 | Five monthly leases, evenly spaced. The top of the range is a test, not a signed rent. |
| Send line | 8 out of 10 | The phone brief is marked ready only at 8 or above. Lower scores stay on the desk. |

---

# Tutorial

The worked example is **Sample Rambler SW, Tumwater WA**. It is not a live listing.

- List price $495,000
- 3 bedrooms, 2 baths
- 2-car garage, about 440 sq ft
- Public sewer
- Level entry and finished ceiling marked confirmed, so the example can show a full pass

A real house starts with ceiling and entry unchecked. An unchecked ceiling cannot score a 10.

## Steps

1. Run `npm run dev` and open the score page.
2. Click **Load worked example**.
3. Read the cash-in figure. It is 25% of $495,000 plus $60,000 plus $10,000 plus $20,000.
4. Read the top 5. The first row is the cheapest buy-box price at the $6,000 lease test. That is a market screen, not a price you can force onto this house.
5. Read “This list price, five leases.” The phone brief uses one of these rows. $6,000 is the top of the range, not a signed rent. Click a lower lease to see the brief change.
6. Open the deal book. The sample row is there. Download the CSV if you want it in a spreadsheet.

## What the iPhone preview is

An incoming message on an iPhone 13 Pro Max frame. It lists the address, list price, lease test, cash flow, NPV, IRR, payback, ROI, and the score. If the score is under 8, the message says it was held.

Nothing is sent. Copy the text if you want it on a phone.

## Why the dollars differ from older drafts

Those drafts multiplied the loan by a flat factor and approximated IRR with polynomial roots. This tutorial uses the app’s amortization and a solved IRR. Trust the page, not the old table.


## Top 5 on the sample

### 1

Buy $450,000 | Lease $6,000/mo
Cash flow: $2,716.40/mo ($32,596.78/yr)
NPV: $191,960
IRR: 20.60%
Payback: 6.2 years
ROI: 16.10%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $16,822, inside the $20,000 hold.
Evidence on this row: cash flow $2,716/mo, ROI 16.1%, cash in $202,500.

### 2

Buy $475,000 | Lease $6,000/mo
Cash flow: $2,570.83/mo ($30,849.93/yr)
NPV: $181,882
IRR: 19.52%
Payback: 6.8 years
ROI: 14.78%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $17,695, inside the $20,000 hold.
Evidence on this row: cash flow $2,571/mo, ROI 14.8%, cash in $208,750.

### 3

Buy $500,000 | Lease $6,000/mo
Cash flow: $2,425.26/mo ($29,103.09/yr)
NPV: $171,804
IRR: 18.51%
Payback: 7.4 years
ROI: 13.54%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $18,568, inside the $20,000 hold.
Evidence on this row: cash flow $2,425/mo, ROI 13.5%, cash in $215,000.

### 4

Buy $450,000 | Lease $5,375/mo
Cash flow: $2,141.40/mo ($25,696.78/yr)
NPV: $142,068
IRR: 17.42%
Payback: 7.9 years
ROI: 12.69%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $16,822, inside the $20,000 hold.
Evidence on this row: cash flow $2,141/mo, ROI 12.7%, cash in $202,500.

### 5

Buy $525,000 | Lease $6,000/mo
Cash flow: $2,279.69/mo ($27,356.24/yr)
NPV: $161,726
IRR: 17.58%
Payback: 8.1 years
ROI: 12.36%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $19,442, inside the $20,000 hold.
Evidence on this row: cash flow $2,280/mo, ROI 12.4%, cash in $221,250.


## This list price, five leases

### 1

Buy $495,000 | Lease $6,000/mo
Cash flow: $2,454.37/mo ($29,452.45/yr)
NPV: $173,820
IRR: 18.71%
Payback: 7.3 years
ROI: 13.78%

10/10 · Invest
Cash-on-cash return is at least 11% and monthly cash flow clears $1,800 on this lease test.
Six-month carry is $18,394, inside the $20,000 hold.
Evidence on this row: cash flow $2,454/mo, ROI 13.8%, cash in $213,750.

### 2

Buy $495,000 | Lease $5,375/mo
Cash flow: $1,879.37/mo ($22,552.45/yr)
NPV: $123,928
IRR: 15.74%
Payback: 9.5 years
ROI: 10.55%

8/10 · Invest
Return clears 8% with at least $1,000 a month of cash flow after the conversion budget.
Six-month carry is $18,394, inside the $20,000 hold.
Evidence on this row: cash flow $1,879/mo, ROI 10.6%, cash in $213,750.

### 3

Buy $495,000 | Lease $4,750/mo
Cash flow: $1,304.37/mo ($15,652.45/yr)
NPV: $74,037
IRR: 12.80%
Payback: 13.7 years
ROI: 7.32%

6/10 · Watch
The lease covers the bills, and the payback is slow for the cash tied up in the down payment, remodel, and hold.
Six-month carry is $18,394, inside the $20,000 hold.
Evidence on this row: cash flow $1,304/mo, ROI 7.3%, cash in $213,750.

### 4

Buy $495,000 | Lease $4,125/mo
Cash flow: $729.37/mo ($8,752.45/yr)
NPV: $24,146
IRR: 9.90%
Payback: 24.4 years
ROI: 4.09%

5/10 · Watch
Cash flow is positive and still under $1,000 a month, so one overrun consumes the cushion.
Six-month carry is $18,394, inside the $20,000 hold.
Evidence on this row: cash flow $729/mo, ROI 4.1%, cash in $213,750.

### 5

Buy $495,000 | Lease $3,500/mo
Cash flow: $154.37/mo ($1,852.45/yr)
NPV: -$25,745
IRR: 7.02%
Payback: Over 40 years
ROI: 0.87%

2/10 · Pass
Monthly cash flow is under $500. That is too thin for a vacant month, a licensing hold, or a permit delay.
Six-month carry is $18,394, inside the $20,000 hold.
Evidence on this row: cash flow $154/mo, ROI 0.9%, cash in $213,750.


### Phone brief

```
AFH MATCH
Sample Rambler SW, Tumwater WA
List $495,000
Lease test $6,000/mo
Flow $2,454/mo
NPV $173,820
IRR 18.7%
Payback 7.3 years
ROI 13.8%
10/10 Invest
Desk screen only. Not a WABO pass.
```

---

# Words for each channel

## Facebook

*Social · Feed post*

### Stop touring houses that cannot become a 6-bed Adult Family Home

A garage conversion in Thurston or Lewis County fails in the same few places: the price, the sewer, the garage, and the cash left after a $60,000 remodel.

AFH Conversion Score is the desk routine for that screen.

Paste a Zillow link, a street address, an NWMLS number, or the Agent Full text. The desk builds the 5 by 5 buy box from $450,000 to $550,000 and $3,500 to $6,000 a month, then ranks the top 5 on cash flow, NPV, IRR, payback, and ROI.

A score of 8 or higher writes a phone brief. Anything thinner stays on the desk.

This is a planning screen, not a WABO approval and not a loan commitment.

The search starts within 30 miles of 3571 Cassie Drive SW, Tumwater.

## Instagram

*Social · Caption*

### The house is not the deal. The cash after the conversion is the deal.

AFH Conversion Score

Thurston. Lewis. 30 miles of Tumwater.

$450k–$550k
Lease tests $3,500–$6,000
Remodel $60,000
Hold $20,000
Extra $10,000

Five prices. Five rents. Top 5 on one table.
Cash flow. NPV. IRR. Payback. ROI. A 1–10 judgement with the reason next to it.

Public sewer and a real 2-car garage, or the score comes down.
Septic without a 6-bedroom approval does not get a polite pass.

Desk screen only. The building official still has to walk the garage.

## Threads

*Social · Short post*

### Same house, twenty-five ways

I got tired of rescoring the same Adult Family Home conversion by hand.

Buy box: $450,000 to $550,000.
Lease the operator might pay: $3,500 to $6,000.
Cash in: 25% down, plus $60,000 remodel, $10,000 extra, $20,000 for six months of carry.

AFH Conversion Score runs that 5×5 every time, keeps the top 5, and writes the phone brief only if the score is 8 or better.

Tumwater hub. Thurston and Lewis. Garage has to be a garage. Septic has to be sized for 6 bedrooms.

It does not log into NWMLS. You paste the link or the listing text. The math is the routine.

## Blogger

*Blog · Article*

### A repeatable screen for Adult Family Home conversions around Tumwater

Buying a house to lease to an Adult Family Home operator is a conversion problem before it is a rent problem. The house has to start as a 3-bedroom, 2-bath home, give you a 2-car garage you can turn into bedrooms, and sit on sewer that can serve six residents. Then the cash has to survive the remodel.

The desk I use is called AFH Conversion Score. The buy box is five purchase prices from $450,000 to $550,000 and five monthly leases from $3,500 to $6,000. Every cell uses the same stack: 25% down, a 6.75% planning rate on a 30-year loan, a 1.15% tax allowance, $2,200 of insurance, an 8% operating reserve, $60,000 of remodel, $10,000 extra, and a $20,000 six-month hold.

The output is a table. Column one is the rank. Column two is the scenario: cash flow, net present value, internal rate of return, years of payback, and cash-on-cash ROI. Column three is a 1 to 10 judgement with the reason and the evidence.

A few rules keep the table honest. A septic system that is not approved for 6 bedrooms adds $15,000 and cannot score a 10. Fewer than two garage spaces adds $30,000. If the finished garage ceiling is not confirmed near 7.5 feet, the score stops at 8. The phone brief is prepared only at 8 or above, and the wording says "desk screen," not "inspection passed."

NWMLS Matrix links stay behind the broker login. The routine reads the link for what it is, then asks for the Agent Full text or the typed facts. That is slower than a scraper and it is the version that keeps working.

The search geography is Thurston County, Lewis County, and a 30-mile radius of 3571 Cassie Drive SW in Tumwater. City names are a screen, not a survey.

None of this is a lender quote, a tax opinion, or a DSHS licensing decision. It is the same worksheet, run the same way, on the next house.

## Naver blog

*Blog · 네이버 블로그*

### 터무워터 30마일, 성인 가족 홈으로 바꿀 집을 같은 표로 거르는 법

워싱턴주 Thurston과 Lewis 카운티에서 집을 산 뒤 Adult Family Home(AFH, 최대 6인 거주 돌봄 주택) 운영자에게 장기 임대하려면, 집값이 싸 보이는 것만으로는 부족합니다. 차고를 침실로 바꾸는 공사, 6개월 보유 비용, 하수 처리, 그리고 임대료가 대출을 이기고 남는지를 매번 같은 순서로 봐야 합니다.

AFH Conversion Score는 그 반복 업무를 위한 데스크 화면입니다.

매입 가격 5단계: 45만 달러에서 55만 달러.
운영자 임대료 5단계: 월 3,500달러에서 6,000달러.
현금 투입: 계약금 25%, 리모델링 6만 달러, 예비비 1만 달러, 6개월 보유비 2만 달러.
금리 가정: 투자용 30년 6.75%. 재산세 가정: 연 1.15%. 보험: 연 2,200달러.

25개 조합을 계산한 뒤 상위 5개만 표로 남깁니다. 칸은 순위, 지표 이름(현금흐름, NPV, IRR, 회수 기간, ROI), 그리고 1점에서 10점까지의 판단과 근거입니다.

점수가 8 미만이면 휴대폰으로 보낼 브리프를 만들지 않습니다. 정화조가 6베드룸용으로 승인되지 않았거나, 차고가 2대가 아니거나, 천장 높이를 확인하지 않았다면 점수를 깎습니다. 이 점수는 WABO 검사 합격을 대신하지 않습니다. 검사를 통과할 후보를 고르는 계산입니다.

입력은 질로우 링크, 주소, NWMLS 번호, 또는 매물 설명 텍스트입니다. NWMLS 로그인 화면을 우회하지 않습니다.

기준 위치는 Tumwater의 3571 Cassie Drive SW, 반경 30마일입니다.

## Tistory

*Blog · 티스토리*

### 같은 집을 25번 계산하는 이유: AFH 전환 점수표

Adult Family Home 전환은 감으로 고르면 리모델링 예산이 먼저 무너집니다. 그래서 매물을 받을 때마다 같은 표를 다시 만들기로 했습니다.

이름: AFH Conversion Score
지역: 워싱턴 Tumwater 3571 Cassie Drive SW 기준 30마일, Thurston과 Lewis 카운티
목표: 방 3개, 욕실 2개 이상인 집을 차고 공사로 6인 AFH 임대용으로 바꿀 수 있는지

표의 세로축은 매입가 45만–55만 달러, 가로축은 월 임대 3,500–6,000달러입니다. 각 칸마다 월 현금흐름, 10년 NPV, IRR, 회수 연수, 현금 대비 ROI를 계산하고 1–10점으로 적습니다.

현금이 들어가는 곳은 네 군데입니다. 집값의 25%, 차고 리모델링 6만 달러, 허가와 예외 비용 1만 달러, 공사 기간 6개월 보유비 2만 달러. 보유비 2만 달러는 한도가 맞고, 실제 6개월 원리금과 세금, 보험이 그 한도를 넘으면 표에 표시합니다.

정화조 매물은 6베드룸 승인이 적혀 있지 않으면 가산 비용 1만 5천 달러를 더하고 점수를 7 이하로 막습니다. 카운티 보건국 기준의 용량 초과 공사는 이 예비비를 쉽게 넘습니다.

결과 문구는 "검사 통과"가 아니라 "데스크 스크리닝"입니다. 건물 담당관이 차고를 보기 전에는 합격이 아닙니다.

글의 숫자는 2026년 10월 데스크 가정입니다. 대출 약정이나 세무 조언이 아닙니다.

## WordPress

*Blog · Article*

### How the AFH Conversion Score desk sorts a listing

The point of a routine is that the next house is scored the same way as the last one.

AFH Conversion Score is that routine for a specific conversion: a 3-bedroom, 2-bath house in Thurston or Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, turned into a 6-resident Adult Family Home by a garage remodel and then leased to an operator.

What you paste
A Zillow link, another website link, a street address, an NWMLS number, or the Agent Full text from Matrix. Matrix itself stays behind your login. The app reads the link and the text you give it. It does not sign in for you.

What it computes
Twenty-five combinations. Five prices from $450,000 to $550,000. Five leases from $3,500 to $6,000 a month. Your list price is also scored on those five leases, because you cannot buy a $495,000 house at the $450,000 cell just because that cell looks better.

Cash invested is the down payment (25%), $60,000 remodel, $10,000 extra, and $20,000 of holding cost. The mortgage uses a 6.75%, 30-year amortization. Tax is a 1.15% planning rate. Insurance is $2,200 a year. Operating reserve is 8% of the lease. Over 10 years, rent grows 2.5%, tax and insurance grow 2%, and the mortgage payment stays flat. Year 10 adds sale equity at 3% appreciation, without selling costs, so that part of NPV and IRR is optimistic.

What the table says
Rank, the indicators, and a 1–10 judgement with the reason. Eight or above is the only row that prepares a phone brief. The brief is a preview on the desk. This deployment does not send it through a mailbox.

What it refuses to pretend
It will not say a garage passed WABO. It will not treat a 3-bedroom septic system as a 6-resident system. It will not hide a list price that misses the buy box.

## Newsletter

*Letter · Issue*

### Desk note: the conversion score is the same sheet every time

This week’s desk is a single worksheet with a name: AFH Conversion Score.

If you are looking at houses to lease to an Adult Family Home operator around Tumwater, the sort is no longer a fresh spreadsheet. The buy box is fixed. $450,000 to $550,000. Lease tests of $3,500 to $6,000. Cash in of 25% down, $60,000 for the garage conversion, $10,000 extra, and $20,000 to hold the house for six months.

The top five rows are the only rows that matter on the first pass. Each row carries cash flow, NPV, IRR, payback, ROI, and a score from 1 to 10 with the reason written out. A septic tank that is not sized for six bedrooms, a one-car garage, or an unconfirmed ceiling will not be talked into a 10.

Geography stays put: Thurston County, Lewis County, and 30 miles from 3571 Cassie Drive SW, Tumwater.

The phone brief is prepared at 8 or above and worded as a desk screen. The building department still has to pass the garage. I would rather miss a fast text than send a false pass.

Next house, same sheet.

## Email

*Letter · Letter to a partner*

### Subject: AFH desk — how a listing gets a score

Hello,

I built a repeatable screen for the Adult Family Home conversion search around Tumwater. The name is AFH Conversion Score.

When a listing shows up, the entry is a Zillow link, a street address, an NWMLS number, or the Agent Full text. Matrix links are not opened automatically. They sit behind the NWMLS login, so the facts have to be pasted or typed.

The sheet then does three things.

1. It checks the house against the conversion: 3 bedrooms and 2 baths to start, a 2-car garage, public sewer or a septic system already approved for 6 bedrooms, and a location in Thurston County, Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater.

2. It prices the cash: 25% down, $60,000 remodel, $10,000 extra, $20,000 for six months of mortgage, tax, insurance, and HOA. The planning rate is 6.75% on a 30-year loan. Tax is carried at 1.15%. Insurance is $2,200 a year.

3. It runs 25 combinations of price and lease, plus the five leases at the actual list price, and ranks them. The columns are the rank, the indicators (cash flow, NPV, IRR, payback, ROI), and a 1–10 judgement with the evidence.

I only prepare a phone brief at 8 or above. The brief says the result is a desk screen, not a passed inspection.

Figures will not match the rough tables from earlier drafts. Those drafts used a flat mortgage factor and an IRR shortcut that is not an internal rate of return. This sheet uses standard amortization and a solved IRR.

This is not a loan approval, a tax opinion, or a DSHS decision.

— Henry


---

# Searches added later

This file holds the written record and the worked example. It does not change by itself when you score a new house.

In the running desk, open **Full project record**. Chapter 8, "Searches in this record," appends each new score package: checklist, top 5, the five leases at the list price, and the phone brief. Chapter 9 is the score desk, so the next house can be added without leaving the document.

Scores stay in the browser. They are not uploaded to this repository.
