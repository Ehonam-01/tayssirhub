"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";
import { EXPENSE_CATEGORIES, NO_CAMPAIGN_VALUE } from "@/lib/validations/expense";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/expense-labels";
import { CURRENCIES } from "@/lib/validations/campaign";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseForm({
  action,
  defaultValues,
  campaignId,
  campaigns,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Expense>;
  campaignId?: string;
  campaigns?: { id: string; name: string }[];
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  const campaignItems: Record<string, string> = {
    [NO_CAMPAIGN_VALUE]: "Aucune campagne (dépense générale)",
    ...Object.fromEntries((campaigns ?? []).map((c) => [c.id, c.name])),
  };

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {campaignId ? (
        <input type="hidden" name="campaignId" value={campaignId} />
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="campaignId">Campagne</Label>
          <Select
            name="campaignId"
            defaultValue={defaultValues?.campaign_id ?? NO_CAMPAIGN_VALUE}
            items={campaignItems}
          >
            <SelectTrigger id="campaignId" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_CAMPAIGN_VALUE}>Aucune campagne (dépense générale)</SelectItem>
              {campaigns?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="label">Libellé</Label>
        <Input
          id="label"
          name="label"
          placeholder="Ex. Location bus Djeddah-Médine"
          defaultValue={defaultValues?.label ?? ""}
          required
        />
        <FieldError errors={state?.fieldErrors?.label} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Catégorie</Label>
          <Select
            name="category"
            defaultValue={defaultValues?.category ?? "autre"}
            items={EXPENSE_CATEGORY_LABELS}
            required
          >
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {EXPENSE_CATEGORY_LABELS[category]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expenseDate">Date</Label>
          <Input id="expenseDate" name="expenseDate" type="date" defaultValue={defaultValues?.expense_date ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Montant</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.amount ?? undefined}
            required
          />
          <FieldError errors={state?.fieldErrors?.amount} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Devise</Label>
          <Select name="currency" defaultValue={defaultValues?.currency ?? "XOF"} required>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state?.fieldErrors?.currency} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={defaultValues?.notes ?? ""} />
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
