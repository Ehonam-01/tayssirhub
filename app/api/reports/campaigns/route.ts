import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { toXlsx } from "@/lib/xlsx";
import { CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";

const CAMPAIGN_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  full: "Complète",
  closed: "Fermée",
  completed: "Terminée",
};

const HEADERS = [
  "Nom",
  "Type",
  "Statut",
  "Date de départ",
  "Date de retour",
  "Prix",
  "Devise",
  "Quota",
  "Pèlerins inscrits",
];

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const supabase = await createClient();

  const [{ data: campaigns }, { data: pilgrims }] = await Promise.all([
    supabase
      .from("campaigns")
      .select("id, name, type, status, start_date, end_date, price, currency, quota")
      .order("start_date", { ascending: false }),
    supabase.from("pilgrims").select("campaign_id"),
  ]);

  const pilgrimCounts = new Map<string, number>();
  for (const pilgrim of pilgrims ?? []) {
    if (!pilgrim.campaign_id) continue;
    pilgrimCounts.set(pilgrim.campaign_id, (pilgrimCounts.get(pilgrim.campaign_id) ?? 0) + 1);
  }

  const rows = (campaigns ?? []).map((c) => [
    c.name,
    CAMPAIGN_TYPE_LABELS[c.type] ?? c.type,
    CAMPAIGN_STATUS_LABELS[c.status] ?? c.status,
    c.start_date,
    c.end_date,
    c.price,
    c.currency,
    c.quota,
    pilgrimCounts.get(c.id) ?? 0,
  ]);

  const filename = `rapport-campagnes-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const buffer = await toXlsx("Campagnes", HEADERS, rows);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  return new NextResponse(toCsv(HEADERS, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}.csv"`,
    },
  });
}
