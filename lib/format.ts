import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDate(date: string | null | undefined, pattern = "d MMM yyyy") {
  if (!date) return "—";
  try {
    return format(new Date(date), pattern, { locale: fr });
  } catch {
    return "—";
  }
}

export function formatMoney(value: number | null | undefined, currency: string) {
  if (value === null || value === undefined) return "—";
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

// Additionne par devise avant de formater : une agence peut avoir des campagnes
// dans plusieurs devises, il ne faut jamais sommer des montants hétérogènes.
export function formatGroupedMoney(rows: { amount: number; currency: string }[]) {
  if (!rows.length) return "0";
  const totals = new Map<string, number>();
  for (const row of rows) {
    totals.set(row.currency, (totals.get(row.currency) ?? 0) + row.amount);
  }
  return [...totals.entries()].map(([currency, amount]) => formatMoney(amount, currency)).join(" + ");
}
