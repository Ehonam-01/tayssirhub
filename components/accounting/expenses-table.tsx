"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ExpenseRowActions } from "@/components/accounting/expense-row-actions";
import { EXPENSE_CATEGORIES } from "@/lib/validations/expense";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/expense-labels";
import { formatDate, formatMoney } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Expense = Database["public"]["Tables"]["expenses"]["Row"] & {
  campaigns?: { name: string } | null;
};

const CATEGORY_FILTER_LABELS: Record<string, string> = {
  all: "Toutes les catégories",
  ...EXPENSE_CATEGORY_LABELS,
};

export function ExpensesTable({
  expenses,
  campaignId,
  campaigns,
  showCampaignColumn = false,
}: {
  expenses: Expense[];
  campaignId?: string;
  campaigns?: { id: string; name: string }[];
  showCampaignColumn?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return expenses.filter((expense) => {
      const matchesSearch = expense.label.toLowerCase().includes(query);
      const matchesCategory = category === "all" || expense.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

  const columnCount = showCampaignColumn ? 6 : 5;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une dépense..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "all")}
          items={CATEGORY_FILTER_LABELS}
        >
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {EXPENSE_CATEGORIES.map((value) => (
              <SelectItem key={value} value={value}>
                {EXPENSE_CATEGORY_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Libellé</TableHead>
              <TableHead>Catégorie</TableHead>
              {showCampaignColumn && <TableHead>Campagne</TableHead>}
              <TableHead>Montant</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={columnCount} className="py-10 text-center text-muted-foreground">
                  Aucune dépense ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.label}</TableCell>
                <TableCell>
                  <Badge variant="outline">{EXPENSE_CATEGORY_LABELS[expense.category]}</Badge>
                </TableCell>
                {showCampaignColumn && (
                  <TableCell className="text-muted-foreground">
                    {expense.campaigns?.name ?? "Dépense générale"}
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  {formatMoney(expense.amount, expense.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(expense.expense_date)}</TableCell>
                <TableCell>
                  <ExpenseRowActions expense={expense} campaignId={campaignId} campaigns={campaigns} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
