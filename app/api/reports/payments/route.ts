import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { toXlsx } from "@/lib/xlsx";
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/payment-labels";

const HEADERS = [
  "Pèlerin",
  "Campagne",
  "Montant",
  "Devise",
  "Statut",
  "Méthode",
  "Échéance",
  "Date de paiement",
  "Référence",
  "N° reçu",
];

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const supabase = await createClient();

  const { data: payments } = await supabase
    .from("payments")
    .select(
      "amount, currency, status, method, due_date, paid_at, reference, receipt_number, pilgrims(first_name, last_name, campaigns(name))",
    )
    .order("created_at", { ascending: false });

  const rows = (payments ?? []).map((p) => [
    p.pilgrims ? `${p.pilgrims.first_name} ${p.pilgrims.last_name}` : null,
    p.pilgrims?.campaigns?.name ?? null,
    p.amount,
    p.currency,
    PAYMENT_STATUS_LABELS[p.status] ?? p.status,
    p.method ? (PAYMENT_METHOD_LABELS[p.method] ?? p.method) : null,
    p.due_date,
    p.paid_at,
    p.reference,
    p.receipt_number,
  ]);

  const filename = `rapport-paiements-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const buffer = await toXlsx("Paiements", HEADERS, rows);
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
