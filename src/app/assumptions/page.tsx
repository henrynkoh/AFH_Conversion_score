import type { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ASSUMPTION_ROWS } from "@/lib/assumptions";

export const metadata: Metadata = { title: "Assumptions" };

export default function AssumptionsPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs tracking-[0.16em] text-copper uppercase">October 2026 desk screen</p>
      <h1 className="mt-2 font-display text-4xl text-pine">What the numbers assume</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8">
        Change the house. Do not change the sheet unless the desk changes the
        sheet on purpose. These are planning inputs, not a rate lock.
      </p>
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Input</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Why it is here</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSUMPTION_ROWS.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="align-top font-medium">{row.name}</TableCell>
                <TableCell className="align-top whitespace-nowrap">{row.value}</TableCell>
                <TableCell className="align-top">{row.why}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </article>
  );
}
