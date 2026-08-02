import { AddExpenseDialog } from "@/components/accounting/add-expense-dialog";
import { ExpensesTable } from "@/components/accounting/expenses-table";
import { AccountingSummary } from "@/components/accounting/accounting-summary";
import { computeMargin, sumByCurrency } from "@/lib/accounting";
import type { Database } from "@/lib/types/database";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];

export function CampaignExpensesPanel({
  campaignId,
  expenses,
  revenue,
}: {
  campaignId: string;
  expenses: Expense[];
  revenue: { amount: number; currency: string }[];
}) {
  const revenueTotals = sumByCurrency(revenue);
  const expenseTotals = sumByCurrency(expenses);
  const marginTotals = computeMargin(revenueTotals, expenseTotals);

  return (
    <div className="flex flex-col gap-4">
      <AccountingSummary revenue={revenueTotals} expenses={expenseTotals} margin={marginTotals} />

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{expenses.length} dépense(s)</p>
        <AddExpenseDialog campaignId={campaignId} />
      </div>

      <ExpensesTable expenses={expenses} campaignId={campaignId} />
    </div>
  );
}
