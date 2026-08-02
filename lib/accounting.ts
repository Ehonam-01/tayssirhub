// Marges et bénéfices dérivés à la volée à partir des recettes (payments
// status='paid') et dépenses — jamais stockés, même principe que le reliquat
// des paiements ou le badge "Expiré" des documents. Toujours par devise :
// une agence peut avoir des campagnes en XOF et en EUR, jamais additionnées.

export interface CurrencyTotal {
  currency: string;
  amount: number;
}

export interface CampaignBreakdown {
  campaignId: string | null;
  revenue: CurrencyTotal[];
  expenses: CurrencyTotal[];
  margin: CurrencyTotal[];
}

export function sumByCurrency(rows: { amount: number; currency: string }[]): CurrencyTotal[] {
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.amount);
  }
  return [...totals.entries()].map(([currency, amount]) => ({ currency, amount }));
}

export function computeMargin(revenue: CurrencyTotal[], expenses: CurrencyTotal[]): CurrencyTotal[] {
  const totals = new Map<string, number>();
  for (const row of revenue) totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.amount);
  for (const row of expenses) totals.set(row.currency, (totals.get(row.currency) ?? 0) - row.amount);
  return [...totals.entries()].map(([currency, amount]) => ({ currency, amount }));
}

export function computeCampaignBreakdown(
  revenueRows: { campaignId: string | null; amount: number; currency: string }[],
  expenseRows: { campaignId: string | null; amount: number; currency: string }[],
): CampaignBreakdown[] {
  const campaignIds = new Set<string | null>();
  for (const row of revenueRows) campaignIds.add(row.campaignId);
  for (const row of expenseRows) campaignIds.add(row.campaignId);

  return [...campaignIds].map((campaignId) => {
    const revenue = sumByCurrency(revenueRows.filter((row) => row.campaignId === campaignId));
    const expenses = sumByCurrency(expenseRows.filter((row) => row.campaignId === campaignId));
    return { campaignId, revenue, expenses, margin: computeMargin(revenue, expenses) };
  });
}
