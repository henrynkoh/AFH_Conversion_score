import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/copy-button";
import { CHANNELS, channelBySlug } from "@/lib/marketing";

export function generateStaticParams() {
  return CHANNELS.map((channel) => ({ slug: channel.slug }));
}

type ChannelParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ChannelParams): Promise<Metadata> {
  const { slug } = await params;
  const channel = channelBySlug(slug);
  return { title: channel ? channel.name : "Marketing" };
}

export default async function ChannelPage({ params }: ChannelParams) {
  const { slug } = await params;
  const channel = channelBySlug(slug);
  if (!channel) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">
        {channel.kind} · {channel.place}
      </p>
      <h1 className="mt-2 font-display text-4xl text-pine">{channel.name}</h1>
      <h2 className="mt-6 text-xl leading-snug">{channel.title}</h2>
      <div className="mt-4 flex gap-2">
        <CopyButton text={`${channel.title}\n\n${channel.body}`} label="Copy post" />
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card px-5 py-5 whitespace-pre-wrap text-[15px] leading-7">
        {channel.body}
      </div>
    </article>
  );
}
