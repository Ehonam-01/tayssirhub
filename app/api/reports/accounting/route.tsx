import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { AccountingReportDocument } from "@/lib/pdf/accounting-report";
import { computeCampaignBreakdown, sumByCurrency, computeMargin } from "@/lib/accounting";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) {
    return NextResponse.json({ error: "Session invalide." }, { status: 401 });
  }

  const supabase = await createClient();

  const [{ data: agencyRow }, { data: campaigns }, { data: paidPayments }, { data: expenses }] =
    await Promise.all([
      supabase.from("agencies").select("name").eq("id", profile.agency_id).single(),
      supabase.from("campaigns").select("id, name").order("name", { ascending: true }),
      supabase.from("payments").select("amount, currency, pilgrims(campaign_id)").eq("status", "paid"),
      supabase.from("expenses").select("amount, currency, campaign_id"),
    ]);

  const revenueRows = (paidPayments ?? []).map((payment) => ({
    campaignId: payment.pilgrims?.campaign_id ?? null,
    amount: payment.amount,
    currency: payment.currency,
  }));
  const expenseRows = (expenses ?? []).map((expense) => ({
    campaignId: expense.campaign_id,
    amount: expense.amount,
    currency: expense.currency,
  }));

  const revenueTotals = sumByCurrency(revenueRows);
  const expenseTotals = sumByCurrency(expenseRows);
  const marginTotals = computeMargin(revenueTotals, expenseTotals);
  const breakdowns = computeCampaignBreakdown(revenueRows, expenseRows);
  const campaignNames = Object.fromEntries((campaigns ?? []).map((c) => [c.id, c.name]));

  const buffer = await renderToBuffer(
    <AccountingReportDocument
      data={{
        agencyName: agencyRow?.name ?? "Agence",
        generatedAt: new Date().toISOString(),
        revenueTotals,
        expenseTotals,
        marginTotals,
        breakdowns,
        campaignNames,
      }}
    />,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="rapport-comptable-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
