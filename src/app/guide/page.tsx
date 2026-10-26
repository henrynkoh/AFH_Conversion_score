import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Guides" };

const GUIDES = [
  {
    href: "/guide/quickstart",
    title: "Quickstart",
    text: "Install, run, and score the worked example.",
  },
  {
    href: "/guide/manual",
    title: "Manual",
    text: "Every input, the cash stack, and the judgement scale.",
  },
  {
    href: "/guide/tutorial",
    title: "Tutorial",
    text: "Walk the sample rambler and read the live top 5.",
  },
];

export default function GuideIndex() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Read this once</p>
      <h1 className="mt-2 font-display text-4xl text-pine">Guides</h1>
      <div className="mt-8 grid gap-3">
        {GUIDES.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="rounded-xl border border-border bg-card px-4 py-4 hover:border-copper"
          >
            <span className="block font-medium">{guide.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">{guide.text}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
