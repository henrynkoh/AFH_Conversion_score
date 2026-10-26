import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { indicatorText, judgementText } from "@/lib/underwrite";
import type { Scenario } from "@/lib/types";
import { scenarioKey } from "@/lib/report";

export function ScoreTable({
  rows,
  title,
  note,
}: {
  rows: Scenario[];
  title: string;
  note: string;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-display text-2xl text-pine">{title}</h2>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{note}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Number</TableHead>
            <TableHead>
              Name of indicators
              <span className="mt-1 block font-normal text-muted-foreground">
                Cash flow, NPV, IRR, payback, ROI
              </span>
            </TableHead>
            <TableHead>
              Overall judgement
              <span className="mt-1 block font-normal text-muted-foreground">
                1–10 scale, reason and evidence
              </span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={scenarioKey(row)}>
              <TableCell className="align-top font-display text-xl text-pine">
                {index + 1}
              </TableCell>
              <TableCell className="align-top whitespace-pre-line font-mono text-xs leading-5">
                {indicatorText(row)}
              </TableCell>
              <TableCell className="align-top whitespace-pre-line text-sm leading-5">
                {judgementText(row)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
