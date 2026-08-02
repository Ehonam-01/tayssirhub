import { createClient } from "@/lib/supabase/server";
import { AccountingSummary } from "@/components/accounting/accounting-summary";
import { CampaignBreakdownTable } from "@/components/accounting/campaign-breakdown-table";
import { AddExpenseDialog } from "@/components/accounting/add-expense-dialog";
import { ExpensesTable } from "@/components/accounting/expenses-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeCampaignBreakdown, sumByCurrency, computeMargin } from "@/lib/accounting";

export const dynamic = "force-dynamic";

export default async function AccountingPage() {
  const supabase = await createClient();

  const [{ data: campaigns }, { data: paidPayments }, { data: expenses }] = await Promise.all([
    supabase.from("campaigns").select("id, name").order("name", { ascending: true }),
    supabase
      .from("payments")
      .select("amount, currency, pilgrims(campaign_id)")
      .eq("status", "paid"),
    supabase
      .from("expenses")
      .select("*, campaigns(name)")
      .order("expense_date", { ascending: false }),
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Comptabilité</h1>
        <p className="text-sm text-muted-foreground">
          Recettes, dépenses et marges de votre agence, par devise.
        </p>
      </div>

      <AccountingSummary revenue={revenueTotals} expenses={expenseTotals} margin={marginTotals} />

      <Card>
        <CardHeader>
          <CardTitle>Marge par campagne</CardTitle>
        </CardHeader>
        <CardContent>
          <CampaignBreakdownTable breakdowns={breakdowns} campaignNames={campaignNames} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dépenses</CardTitle>
          <AddExpenseDialog campaigns={campaigns ?? []} />
        </CardHeader>
        <CardContent>
          <ExpensesTable expenses={expenses ?? []} campaigns={campaigns ?? []} showCampaignColumn />
        </CardContent>
      </Card>
    </div>
  );
}
