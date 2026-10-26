import type { ReactNode } from "react";

export function Doc({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl text-pine">{title}</h1>
      <p className="mt-4 text-lg leading-8">{lede}</p>
      <div className="mt-8 space-y-4 text-[15px] leading-7 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-pine [&_li]:ml-5 [&_li]:list-disc [&_ol]:space-y-2 [&_ol_li]:list-decimal [&_ul]:space-y-2">
        {children}
      </div>
    </article>
  );
}
