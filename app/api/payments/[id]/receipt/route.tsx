import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { ReceiptDocument } from "@/lib/pdf/receipt";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: payment } = await supabase
    .from("payments")
    .select("*, pilgrims(first_name, last_name, campaigns(name))")
    .eq("id", id)
    .eq("status", "paid")
    .single();

  if (!payment || !payment.method || !payment.paid_at || !payment.receipt_number) {
    return NextResponse.json({ error: "Reçu introuvable." }, { status: 404 });
  }

  const { data: agencyRow } = await supabase
    .from("agencies")
    .select("name")
    .eq("id", payment.agency_id)
    .single();

  const buffer = await renderToBuffer(
    <ReceiptDocument
      data={{
        agencyName: agencyRow?.name ?? "Agence",
        receiptNumber: payment.receipt_number,
        pilgrimName: `${payment.pilgrims?.first_name ?? ""} ${payment.pilgrims?.last_name ?? ""}`.trim(),
        campaignName: payment.pilgrims?.campaigns?.name ?? null,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        paidAt: payment.paid_at,
        reference: payment.reference,
      }}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${payment.receipt_number}.pdf"`,
    },
  });
}
