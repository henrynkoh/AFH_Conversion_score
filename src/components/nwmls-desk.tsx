"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/format";

type House = {
  address: string;
  mls: string;
  price: number;
  score: number;
  verdict: string;
  added: boolean;
};

export function NwmlsDesk({ configured, user }: { configured: boolean; user: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [houses, setHouses] = useState<House[]>([]);

  async function pull() {
    setPending(true);
    setError("");
    setNote("");
    try {
      const response = await fetch("/api/nwmls", { method: "POST" });
      const body = (await response.json()) as {
        ok?: boolean;
        error?: string;
        checked?: number;
        scored?: number;
        houses?: House[];
        errors?: string[];
      };
      if (!response.ok && body.error) {
        setError(body.error);
        return;
      }
      setHouses(body.houses ?? []);
      const problems = body.errors?.filter(Boolean) ?? [];
      setNote(
        problems.length
          ? problems.join(" ")
          : `Checked ${body.checked ?? 0} residential rows. ${body.scored ?? 0} sit in the buy box with at least 3 bedrooms and 2 baths. New scores were written to the search results page.`,
      );
      if (problems.length && !(body.houses ?? []).length) setError(problems.join(" "));
    } catch {
      setError("The desk could not reach NWMLS.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">Member feed</p>
      <h1 className="mt-2 font-display text-4xl text-pine">Connect NWMLS</h1>
      <div className="mt-4 space-y-4 text-[15px] leading-7">
        <p>
          The desk uses your firm’s EverNet login, the web service NWMLS gives a
          member brokerage. It does not open Matrix, does not store a password in
          the repository, and does not accept a password typed into this page.
        </p>
        <p>
          {configured
            ? `A login is present for ${user}. The password stays on this machine.`
            : "No NWMLS login is on this machine yet."}
        </p>
      </div>

      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>Ask the designated broker to confirm the firm’s EverNet / data license is active. A Matrix website password is not issued to this app by itself.</li>
        <li>
          On the computer that runs the desk, create <code>.env.local</code> next to <code>package.json</code> with <code>NWMLS_USER</code> and <code>NWMLS_PASSWORD</code>.
        </li>
        <li>Restart <code>npm run dev</code>. Then use the button below.</li>
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="button" size="lg" className="h-11" disabled={!configured || pending} onClick={pull}>
          {pending ? "Pulling Thurston and Lewis…" : "Pull active listings"}
        </Button>
        <Link href="/guide/manual" className="self-center text-sm underline underline-offset-4">
          What the score still checks
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      {note && !error && <p className="mt-4 text-sm leading-6 text-muted-foreground">{note}</p>}

      {houses.length > 0 && (
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {houses.map((house) => (
            <li key={`${house.mls}-${house.address}`} className="px-4 py-3 text-sm">
              <span className="font-medium">{house.address || "Untitled house"}</span>
              <span className="mt-1 block text-muted-foreground">
                {house.mls ? `NWMLS ${house.mls} · ` : ""}
                {money(house.price)} · {house.score}/10 {house.verdict}
                {house.added ? " · added to search results" : " · already on the search results page"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
