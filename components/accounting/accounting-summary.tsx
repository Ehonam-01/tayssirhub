import { Wallet, Receipt, PiggyBank } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { formatGroupedMoney } from "@/lib/format";
import type { CurrencyTotal } from "@/lib/accounting";

export function AccountingSummary({
  revenue,
  expenses,
  margin,
}: {
  revenue: CurrencyTotal[];
  expenses: CurrencyTotal[];
  margin: CurrencyTotal[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <KpiCard label="Recettes" value={formatGroupedMoney(revenue)} icon={Wallet} />
      <KpiCard label="Dépenses" value={formatGroupedMoney(expenses)} icon={Receipt} />
      <KpiCard label="Marge" value={formatGroupedMoney(margin)} icon={PiggyBank} />
    </div>
  );
}
