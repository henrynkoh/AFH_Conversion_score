import type { PhoneBrief } from "@/lib/types";

export function IphoneBrief({
  brief,
  heartbeat,
}: {
  brief: PhoneBrief;
  heartbeat: string;
}) {
  return (
    <figure className="mx-auto w-full max-w-[300px]">
      <div className="rounded-[2.4rem] border-[11px] border-[#161616] bg-[#161616] shadow-[0_18px_50px_rgba(28,25,20,0.18)]">
        <div className="overflow-hidden rounded-[1.6rem] bg-[#f2f2f7]">
          <div className="relative h-12 bg-[#f2f2f7]">
            <div className="absolute top-0 left-1/2 h-6 w-32 -translate-x-1/2 rounded-b-2xl bg-[#161616]" />
            <div className="flex items-end justify-between px-5 pt-2 text-[11px] font-medium text-[#111]">
              <span>9:41</span>
              <span>5G</span>
            </div>
          </div>
          <div className="border-b border-black/5 px-4 pb-3 text-center">
            <p className="text-[11px] text-[#6d6d72]">Messages</p>
            <p className="text-sm font-semibold">AFH Desk</p>
          </div>
          <div className="space-y-3 px-3 py-4">
            <Bubble tone={brief.send ? "go" : "hold"}>{brief.body}</Bubble>
            <Bubble tone="note">{heartbeat}</Bubble>
            <figcaption className="px-1 text-center text-[11px] leading-4 text-[#6d6d72]">
              iPhone 13 Pro Max preview. {brief.headline}. Nothing is transmitted
              from this server.
            </figcaption>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Bubble({
  children,
  tone,
}: {
  children: string;
  tone: "go" | "hold" | "note";
}) {
  const color =
    tone === "go"
      ? "bg-white text-[#111]"
      : tone === "hold"
        ? "bg-[#ececf1] text-[#3a3a3c]"
        : "bg-[#e5e5ea] text-[#3a3a3c]";
  return (
    <div
      className={`max-w-[92%] rounded-2xl rounded-tl-md px-3 py-2 text-[13px] leading-5 whitespace-pre-line shadow-sm ${color}`}
    >
      {children}
    </div>
  );
}
