import type { Metadata } from "next";
import { Analyzer } from "@/components/analyzer";

export const metadata: Metadata = {
  title: "Score a listing",
};

export default function AnalyzePage() {
  return <Analyzer />;
}
