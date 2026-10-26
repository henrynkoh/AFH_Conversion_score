export type Channel = {
  slug: string;
  name: string;
  place: string;
  kind: string;
  title: string;
  body: string;
};

export const CHANNELS: Channel[] = [
  {
    slug: "facebook",
    name: "Facebook",
    place: "Feed post",
    kind: "Social",
    title: "Stop touring houses that cannot become a 6-bed Adult Family Home",
    body: `A garage conversion in Thurston or Lewis County fails in the same few places: the price, the sewer, the garage, and the cash left after a $60,000 remodel.

AFH Conversion Score is the desk routine for that screen.

Paste a Zillow link, a street address, an NWMLS number, or the Agent Full text. The desk builds the 5 by 5 buy box from $450,000 to $550,000 and $3,500 to $6,000 a month, then ranks the top 5 on cash flow, NPV, IRR, payback, and ROI.

A score of 8 or higher writes a phone brief. Anything thinner stays on the desk.

This is a planning screen, not a WABO approval and not a loan commitment.

The search starts within 30 miles of 3571 Cassie Drive SW, Tumwater.`,
  },
  {
    slug: "instagram",
    name: "Instagram",
    place: "Caption",
    kind: "Social",
    title: "The house is not the deal. The cash after the conversion is the deal.",
    body: `AFH Conversion Score

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

Desk screen only. The building official still has to walk the garage.`,
  },
  {
    slug: "threads",
    name: "Threads",
    place: "Short post",
    kind: "Social",
    title: "Same house, twenty-five ways",
    body: `I got tired of rescoring the same Adult Family Home conversion by hand.

Buy box: $450,000 to $550,000.
Lease the operator might pay: $3,500 to $6,000.
Cash in: 25% down, plus $60,000 remodel, $10,000 extra, $20,000 for six months of carry.

AFH Conversion Score runs that 5×5 every time, keeps the top 5, and writes the phone brief only if the score is 8 or better.

Tumwater hub. Thurston and Lewis. Garage has to be a garage. Septic has to be sized for 6 bedrooms.

It does not log into NWMLS. You paste the link or the listing text. The math is the routine.`,
  },
  {
    slug: "blogger",
    name: "Blogger",
    place: "Article",
    kind: "Blog",
    title: "A repeatable screen for Adult Family Home conversions around Tumwater",
    body: `Buying a house to lease to an Adult Family Home operator is a conversion problem before it is a rent problem. The house has to start as a 3-bedroom, 2-bath home, give you a 2-car garage you can turn into bedrooms, and sit on sewer that can serve six residents. Then the cash has to survive the remodel.

The desk I use is called AFH Conversion Score. The buy box is five purchase prices from $450,000 to $550,000 and five monthly leases from $3,500 to $6,000. Every cell uses the same stack: 25% down, a 6.75% planning rate on a 30-year loan, a 1.15% tax allowance, $2,200 of insurance, an 8% operating reserve, $60,000 of remodel, $10,000 extra, and a $20,000 six-month hold.

The output is a table. Column one is the rank. Column two is the scenario: cash flow, net present value, internal rate of return, years of payback, and cash-on-cash ROI. Column three is a 1 to 10 judgement with the reason and the evidence.

A few rules keep the table honest. A septic system that is not approved for 6 bedrooms adds $15,000 and cannot score a 10. Fewer than two garage spaces adds $30,000. If the finished garage ceiling is not confirmed near 7.5 feet, the score stops at 8. The phone brief is prepared only at 8 or above, and the wording says "desk screen," not "inspection passed."

NWMLS Matrix links stay behind the broker login. The routine reads the link for what it is, then asks for the Agent Full text or the typed facts. That is slower than a scraper and it is the version that keeps working.

The search geography is Thurston County, Lewis County, and a 30-mile radius of 3571 Cassie Drive SW in Tumwater. City names are a screen, not a survey.

None of this is a lender quote, a tax opinion, or a DSHS licensing decision. It is the same worksheet, run the same way, on the next house.`,
  },
  {
    slug: "naver",
    name: "Naver blog",
    place: "네이버 블로그",
    kind: "Blog",
    title: "터무워터 30마일, 성인 가족 홈으로 바꿀 집을 같은 표로 거르는 법",
    body: `워싱턴주 Thurston과 Lewis 카운티에서 집을 산 뒤 Adult Family Home(AFH, 최대 6인 거주 돌봄 주택) 운영자에게 장기 임대하려면, 집값이 싸 보이는 것만으로는 부족합니다. 차고를 침실로 바꾸는 공사, 6개월 보유 비용, 하수 처리, 그리고 임대료가 대출을 이기고 남는지를 매번 같은 순서로 봐야 합니다.

AFH Conversion Score는 그 반복 업무를 위한 데스크 화면입니다.

매입 가격 5단계: 45만 달러에서 55만 달러.
운영자 임대료 5단계: 월 3,500달러에서 6,000달러.
현금 투입: 계약금 25%, 리모델링 6만 달러, 예비비 1만 달러, 6개월 보유비 2만 달러.
금리 가정: 투자용 30년 6.75%. 재산세 가정: 연 1.15%. 보험: 연 2,200달러.

25개 조합을 계산한 뒤 상위 5개만 표로 남깁니다. 칸은 순위, 지표 이름(현금흐름, NPV, IRR, 회수 기간, ROI), 그리고 1점에서 10점까지의 판단과 근거입니다.

점수가 8 미만이면 휴대폰으로 보낼 브리프를 만들지 않습니다. 정화조가 6베드룸용으로 승인되지 않았거나, 차고가 2대가 아니거나, 천장 높이를 확인하지 않았다면 점수를 깎습니다. 이 점수는 WABO 검사 합격을 대신하지 않습니다. 검사를 통과할 후보를 고르는 계산입니다.

입력은 질로우 링크, 주소, NWMLS 번호, 또는 매물 설명 텍스트입니다. NWMLS 로그인 화면을 우회하지 않습니다.

기준 위치는 Tumwater의 3571 Cassie Drive SW, 반경 30마일입니다.`,
  },
  {
    slug: "tistory",
    name: "Tistory",
    place: "티스토리",
    kind: "Blog",
    title: "같은 집을 25번 계산하는 이유: AFH 전환 점수표",
    body: `Adult Family Home 전환은 감으로 고르면 리모델링 예산이 먼저 무너집니다. 그래서 매물을 받을 때마다 같은 표를 다시 만들기로 했습니다.

이름: AFH Conversion Score
지역: 워싱턴 Tumwater 3571 Cassie Drive SW 기준 30마일, Thurston과 Lewis 카운티
목표: 방 3개, 욕실 2개 이상인 집을 차고 공사로 6인 AFH 임대용으로 바꿀 수 있는지

표의 세로축은 매입가 45만–55만 달러, 가로축은 월 임대 3,500–6,000달러입니다. 각 칸마다 월 현금흐름, 10년 NPV, IRR, 회수 연수, 현금 대비 ROI를 계산하고 1–10점으로 적습니다.

현금이 들어가는 곳은 네 군데입니다. 집값의 25%, 차고 리모델링 6만 달러, 허가와 예외 비용 1만 달러, 공사 기간 6개월 보유비 2만 달러. 보유비 2만 달러는 한도가 맞고, 실제 6개월 원리금과 세금, 보험이 그 한도를 넘으면 표에 표시합니다.

정화조 매물은 6베드룸 승인이 적혀 있지 않으면 가산 비용 1만 5천 달러를 더하고 점수를 7 이하로 막습니다. 카운티 보건국 기준의 용량 초과 공사는 이 예비비를 쉽게 넘습니다.

결과 문구는 "검사 통과"가 아니라 "데스크 스크리닝"입니다. 건물 담당관이 차고를 보기 전에는 합격이 아닙니다.

글의 숫자는 2026년 10월 데스크 가정입니다. 대출 약정이나 세무 조언이 아닙니다.`,
  },
  {
    slug: "wordpress",
    name: "WordPress",
    place: "Article",
    kind: "Blog",
    title: "How the AFH Conversion Score desk sorts a listing",
    body: `The point of a routine is that the next house is scored the same way as the last one.

AFH Conversion Score is that routine for a specific conversion: a 3-bedroom, 2-bath house in Thurston or Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater, turned into a 6-resident Adult Family Home by a garage remodel and then leased to an operator.

What you paste
A Zillow link, another website link, a street address, an NWMLS number, or the Agent Full text from Matrix. Matrix itself stays behind your login. The app reads the link and the text you give it. It does not sign in for you.

What it computes
Twenty-five combinations. Five prices from $450,000 to $550,000. Five leases from $3,500 to $6,000 a month. Your list price is also scored on those five leases, because you cannot buy a $495,000 house at the $450,000 cell just because that cell looks better.

Cash invested is the down payment (25%), $60,000 remodel, $10,000 extra, and $20,000 of holding cost. The mortgage uses a 6.75%, 30-year amortization. Tax is a 1.15% planning rate. Insurance is $2,200 a year. Operating reserve is 8% of the lease. Over 10 years, rent grows 2.5%, tax and insurance grow 2%, and the mortgage payment stays flat. Year 10 adds sale equity at 3% appreciation, without selling costs, so that part of NPV and IRR is optimistic.

What the table says
Rank, the indicators, and a 1–10 judgement with the reason. Eight or above is the only row that prepares a phone brief. The brief is a preview on the desk. This deployment does not send it through a mailbox.

What it refuses to pretend
It will not say a garage passed WABO. It will not treat a 3-bedroom septic system as a 6-resident system. It will not hide a list price that misses the buy box.`,
  },
  {
    slug: "newsletter",
    name: "Newsletter",
    place: "Issue",
    kind: "Letter",
    title: "Desk note: the conversion score is the same sheet every time",
    body: `This week’s desk is a single worksheet with a name: AFH Conversion Score.

If you are looking at houses to lease to an Adult Family Home operator around Tumwater, the sort is no longer a fresh spreadsheet. The buy box is fixed. $450,000 to $550,000. Lease tests of $3,500 to $6,000. Cash in of 25% down, $60,000 for the garage conversion, $10,000 extra, and $20,000 to hold the house for six months.

The top five rows are the only rows that matter on the first pass. Each row carries cash flow, NPV, IRR, payback, ROI, and a score from 1 to 10 with the reason written out. A septic tank that is not sized for six bedrooms, a one-car garage, or an unconfirmed ceiling will not be talked into a 10.

Geography stays put: Thurston County, Lewis County, and 30 miles from 3571 Cassie Drive SW, Tumwater.

The phone brief is prepared at 8 or above and worded as a desk screen. The building department still has to pass the garage. I would rather miss a fast text than send a false pass.

Next house, same sheet.`,
  },
  {
    slug: "email",
    name: "Email",
    place: "Letter to a partner",
    kind: "Letter",
    title: "Subject: AFH desk — how a listing gets a score",
    body: `Hello,

I built a repeatable screen for the Adult Family Home conversion search around Tumwater. The name is AFH Conversion Score.

When a listing shows up, the entry is a Zillow link, a street address, an NWMLS number, or the Agent Full text. Matrix links are not opened automatically. They sit behind the NWMLS login, so the facts have to be pasted or typed.

The sheet then does three things.

1. It checks the house against the conversion: 3 bedrooms and 2 baths to start, a 2-car garage, public sewer or a septic system already approved for 6 bedrooms, and a location in Thurston County, Lewis County, or within 30 miles of 3571 Cassie Drive SW, Tumwater.

2. It prices the cash: 25% down, $60,000 remodel, $10,000 extra, $20,000 for six months of mortgage, tax, insurance, and HOA. The planning rate is 6.75% on a 30-year loan. Tax is carried at 1.15%. Insurance is $2,200 a year.

3. It runs 25 combinations of price and lease, plus the five leases at the actual list price, and ranks them. The columns are the rank, the indicators (cash flow, NPV, IRR, payback, ROI), and a 1–10 judgement with the evidence.

I only prepare a phone brief at 8 or above. The brief says the result is a desk screen, not a passed inspection.

Figures will not match the rough tables from earlier drafts. Those drafts used a flat mortgage factor and an IRR shortcut that is not an internal rate of return. This sheet uses standard amortization and a solved IRR.

This is not a loan approval, a tax opinion, or a DSHS decision.

— Henry`,
  },
];

export function channelBySlug(slug: string): Channel | undefined {
  return CHANNELS.find((channel) => channel.slug === slug);
}
