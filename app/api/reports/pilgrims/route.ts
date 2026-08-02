import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { toXlsx } from "@/lib/xlsx";
import { CRM_STAGE_LABELS } from "@/lib/crm-labels";

const GENDER_LABELS: Record<string, string> = { homme: "Homme", femme: "Femme" };

const PILGRIM_STATUS_LABELS: Record<string, string> = {
  prospect: "Prospect",
  inscrit: "Inscrit",
  dossier_incomplet: "Dossier incomplet",
  dossier_complet: "Dossier complet",
  confirme: "Confirmé",
  parti: "Parti",
  revenu: "Revenu",
  annule: "Annulé",
};

const HEADERS = [
  "Prénom",
  "Nom",
  "Genre",
  "Téléphone",
  "Email",
  "Nationalité",
  "Campagne",
  "Statut dossier",
  "Étape CRM",
  "Guide",
  "Prix package",
  "Devise",
];

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const supabase = await createClient();

  const { data: pilgrims } = await supabase
    .from("pilgrims")
    .select(
      "first_name, last_name, gender, phone, email, nationality, status, crm_stage, package_price, campaigns(name, currency), guides(full_name)",
    )
    .order("last_name", { ascending: true });

  const rows = (pilgrims ?? []).map((p) => [
    p.first_name,
    p.last_name,
    p.gender ? (GENDER_LABELS[p.gender] ?? p.gender) : null,
    p.phone,
    p.email,
    p.nationality,
    p.campaigns?.name ?? null,
    PILGRIM_STATUS_LABELS[p.status] ?? p.status,
    CRM_STAGE_LABELS[p.crm_stage] ?? p.crm_stage,
    p.guides?.full_name ?? null,
    p.package_price,
    p.package_price ? (p.campaigns?.currency ?? null) : null,
  ]);

  const filename = `rapport-pelerins-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const buffer = await toXlsx("Pèlerins", HEADERS, rows);
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
