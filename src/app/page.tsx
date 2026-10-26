import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CHANNELS } from "@/lib/marketing";
import { cn } from "cn";

const DESK = [
  { href: "/analyze", title: "Score a listing", text: "Link, address, NWMLS number, or pasted text." },
  { href: "/archive", title: "Deal book", text: "Every score kept in this browser, with a CSV export." },
  { href: "/method", title: "Six Sigma routine", text: "Define, measure, analyze, improve, control." },
  { href: "/assumptions", title: "Assumptions", text: "The rates, the caps, and what they leave out." },
];

const LEARN = [
  { href: "/guide/quickstart", title: "Quickstart", text: "First score in one sitting." },
  { href: "/guide/manual", title: "Manual", text: "Inputs, formulas, and the send line." },
  { href: "/guide/tutorial", title: "Tutorial", text: "The worked Tumwater example, with live numbers." },
  { href: "/guide", title: "All guides", text: "The three documents in one place." },
];

export default function Home() {
  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs tracking-[0.18em] text-copper uppercase">
              Thurston · Lewis · 30 miles of Tumwater
            </p>
            <h1 className="mt-3 max-w-xl font-display text-5xl leading-[1.05] text-pine sm:text-6xl">
              The house is scored before the tour gets expensive.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8">
              AFH Conversion Score is the repeatable screen for a 3-bedroom house
              you would convert, by garage remodel, into a 6-resident Adult Family
              Home and lease to an operator.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/analyze" className={cn(buttonVariants({ size: "lg" }), "h-11 px-4")}>
                Score a listing
              </Link>
              <Link
                href="/record"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 border-[#9b1c1c] bg-[#c62828] px-4 text-white hover:bg-[#9b1c1c]",
                )}
              >
                Full project record
              </Link>
              <Link
                href="/guide/quickstart"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }), "h-11 px-4")}
              >
                Quickstart
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {[
              ["Buy box", "$450k–$550k"],
              ["Lease tests", "$3,500–$6,000"],
              ["Remodel", "$60,000"],
              ["Six-month hold", "$20,000"],
            ].map(([label, value]) => (
              <div key={label} className="bg-card px-4 py-5">
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">{label}</dt>
                <dd className="mt-1 font-display text-2xl text-pine">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-display text-3xl text-pine">Open a piece of the desk</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Each button is a page. The score is the work. The guides explain the
          sheet. The marketing pages are the words for each channel.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DESK.map((item) => (
            <Door key={item.href} {...item} />
          ))}
          {LEARN.map((item) => (
            <Door key={item.href} {...item} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-3xl text-pine">Publish</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Copy written for the channel it sits on. Naver and Tistory are in Korean.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((channel) => (
              <Door
                key={channel.slug}
                href={`/marketing/${channel.slug}`}
                title={channel.name}
                text={channel.place}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Door({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-border bg-background px-4 py-4 transition-colors hover:border-copper hover:bg-card"
    >
      <span className="block font-medium">{title}</span>
      <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
    </Link>
  );
}
