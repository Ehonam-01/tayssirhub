import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { toCsv } from "@/lib/csv";
import { toXlsx } from "@/lib/xlsx";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/expense-labels";

const HEADERS = ["Libellé", "Catégorie", "Campagne", "Montant", "Devise", "Date", "Notes"];

export async function GET(request: Request) {
  const format = new URL(request.url).searchParams.get("format") === "xlsx" ? "xlsx" : "csv";
  const supabase = await createClient();

  const { data: expenses } = await supabase
    .from("expenses")
    .select("label, category, amount, currency, expense_date, notes, campaigns(name)")
    .order("expense_date", { ascending: false });

  const rows = (expenses ?? []).map((e) => [
    e.label,
    EXPENSE_CATEGORY_LABELS[e.category] ?? e.category,
    e.campaigns?.name ?? "Dépense générale",
    e.amount,
    e.currency,
    e.expense_date,
    e.notes,
  ]);

  const filename = `rapport-depenses-${new Date().toISOString().slice(0, 10)}`;

  if (format === "xlsx") {
    const buffer = await toXlsx("Dépenses", HEADERS, rows);
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
