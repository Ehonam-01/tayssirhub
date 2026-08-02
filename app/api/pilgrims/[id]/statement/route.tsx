import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { StatementDocument } from "@/lib/pdf/statement";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pilgrim } = await supabase
    .from("pilgrims")
    .select("first_name, last_name, package_price, agency_id, campaigns(name, price, currency)")
    .eq("id", id)
    .single();

  if (!pilgrim) {
    return NextResponse.json({ error: "Pèlerin introuvable." }, { status: 404 });
  }

  const { data: payments } = await supabase
    .from("payments")
    .select("amount, method, paid_at, receipt_number")
    .eq("pilgrim_id", id)
    .eq("status", "paid")
    .order("paid_at", { ascending: true });

  const { data: agencyRow } = await supabase
    .from("agencies")
    .select("name")
    .eq("id", pilgrim.agency_id)
    .single();

  const currency = pilgrim.campaigns?.currency ?? "XOF";
  const totalDue = pilgrim.package_price ?? pilgrim.campaigns?.price ?? null;

  const buffer = await renderToBuffer(
    <StatementDocument
      data={{
        agencyName: agencyRow?.name ?? "Agence",
        pilgrimName: `${pilgrim.first_name} ${pilgrim.last_name}`,
        campaignName: pilgrim.campaigns?.name ?? null,
        currency,
        totalDue,
        payments: (payments ?? []).map((p) => ({
          paidAt: p.paid_at as string,
          method: p.method,
          receiptNumber: p.receipt_number,
          amount: p.amount,
        })),
        generatedAt: new Date().toISOString(),
      }}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="releve-${pilgrim.last_name}.pdf"`,
    },
  });
}
