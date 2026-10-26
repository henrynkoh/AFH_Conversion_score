import type { Metadata } from "next";
import Link from "next/link";
import { CHANNELS } from "@/lib/marketing";

export const metadata: Metadata = { title: "Marketing" };

export default function MarketingIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Channels</p>
      <h1 className="mt-2 font-display text-4xl text-pine">Words for each place</h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        One page per channel. Copy the text and post it where it belongs.
      </p>
      <div className="mt-8 grid gap-3">
        {CHANNELS.map((channel) => (
          <Link
            key={channel.slug}
            href={`/marketing/${channel.slug}`}
            className="rounded-xl border border-border bg-card px-4 py-4 hover:border-copper"
          >
            <span className="text-xs tracking-wide text-copper uppercase">{channel.kind}</span>
            <span className="mt-1 block font-medium">
              {channel.name} · {channel.place}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">{channel.title}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
