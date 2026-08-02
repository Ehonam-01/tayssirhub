"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { expenseSchema, NO_CAMPAIGN_VALUE } from "@/lib/validations/expense";
import type { ActionState } from "@/lib/actions/types";

function parseExpenseForm(formData: FormData) {
  return expenseSchema.safeParse({
    campaignId: formData.get("campaignId") ?? "",
    category: formData.get("category"),
    label: formData.get("label"),
    amount: formData.get("amount"),
    currency: formData.get("currency") || "XOF",
    expenseDate: formData.get("expenseDate") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function resolveCampaignId(campaignId: string) {
  return campaignId && campaignId !== NO_CAMPAIGN_VALUE ? campaignId : null;
}

function revalidateExpensePaths(campaignId?: string | null) {
  if (campaignId) revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/accounting");
  revalidatePath("/dashboard");
}

export async function createExpense(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseExpenseForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const campaignId = resolveCampaignId(parsed.data.campaignId ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    agency_id: profile.agency_id,
    campaign_id: campaignId,
    category: parsed.data.category,
    label: parsed.data.label,
    amount: parsed.data.amount,
    currency: parsed.data.currency,
    expense_date: parsed.data.expenseDate || null,
    notes: parsed.data.notes || null,
    created_by: profile.id,
  });

  if (error) return { error: "Impossible d'enregistrer la dépense." };

  revalidateExpensePaths(campaignId);
  return { message: "Dépense enregistrée." };
}

export async function updateExpense(
  expenseId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseExpenseForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const campaignId = resolveCampaignId(parsed.data.campaignId ?? "");

  const supabase = await createClient();
  const { data: expense, error } = await supabase
    .from("expenses")
    .update({
      campaign_id: campaignId,
      category: parsed.data.category,
      label: parsed.data.label,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      expense_date: parsed.data.expenseDate || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", expenseId)
    .select("campaign_id")
    .single();

  if (error || !expense) return { error: "Impossible de modifier la dépense." };

  revalidateExpensePaths(expense.campaign_id);
  return { message: "Dépense modifiée." };
}

export async function deleteExpense(expenseId: string) {
  const supabase = await createClient();
  const { data: expense } = await supabase
    .from("expenses")
    .delete()
    .eq("id", expenseId)
    .select("campaign_id")
    .single();

  revalidateExpensePaths(expense?.campaign_id);
}
