import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatGroupedMoney } from "@/lib/format";
import type { CampaignBreakdown } from "@/lib/accounting";

export function CampaignBreakdownTable({
  breakdowns,
  campaignNames,
}: {
  breakdowns: CampaignBreakdown[];
  campaignNames: Record<string, string>;
}) {
  const sorted = [...breakdowns].sort((a, b) => {
    if (a.campaignId === null) return 1;
    if (b.campaignId === null) return -1;
    return (campaignNames[a.campaignId] ?? "").localeCompare(campaignNames[b.campaignId] ?? "");
  });

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campagne</TableHead>
            <TableHead>Recettes</TableHead>
            <TableHead>Dépenses</TableHead>
            <TableHead>Marge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                Aucune donnée comptable pour l&apos;instant.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((breakdown) => (
            <TableRow key={breakdown.campaignId ?? "general"}>
              <TableCell className="font-medium">
                {breakdown.campaignId ? (
                  <Link href={`/campaigns/${breakdown.campaignId}`} className="hover:underline">
                    {campaignNames[breakdown.campaignId] ?? "Campagne"}
                  </Link>
                ) : (
                  "Dépenses générales"
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{formatGroupedMoney(breakdown.revenue)}</TableCell>
              <TableCell className="text-muted-foreground">{formatGroupedMoney(breakdown.expenses)}</TableCell>
              <TableCell className="font-medium">{formatGroupedMoney(breakdown.margin)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
