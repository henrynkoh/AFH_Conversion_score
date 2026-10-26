import type { Metadata } from "next";
import { NwmlsDesk } from "@/components/nwmls-desk";
import { maskNwmlsUser, readNwmlsCredentials } from "@/lib/nwmls";

export const metadata: Metadata = { title: "Connect NWMLS" };

export default function NwmlsPage() {
  const credentials = readNwmlsCredentials();
  return (
    <NwmlsDesk
      configured={Boolean(credentials)}
      user={credentials ? maskNwmlsUser(credentials.user) : ""}
    />
  );
}
