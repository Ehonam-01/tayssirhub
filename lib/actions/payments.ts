"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { paymentSchema, markAsPaidSchema } from "@/lib/validations/payment";
import type { ActionState } from "@/lib/actions/types";

function parsePaymentForm(formData: FormData) {
  const method = formData.get("method");
  return paymentSchema.safeParse({
    pilgrimId: formData.get("pilgrimId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
    method: method ? method : undefined,
    dueDate: formData.get("dueDate") ?? "",
    paidAt: formData.get("paidAt") ?? "",
    reference: formData.get("reference") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

function revalidatePaymentPaths(pilgrimId?: string | null) {
  if (pilgrimId) revalidatePath(`/pilgrims/${pilgrimId}`);
  revalidatePath("/payments");
  revalidatePath("/dashboard");
}

export async function createPayment(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePaymentForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) redirect("/onboarding");

  const supabase = await createClient();

  const { data: pilgrim } = await supabase
    .from("pilgrims")
    .select("campaigns(currency)")
    .eq("id", parsed.data.pilgrimId)
    .single();

  const currency = pilgrim?.campaigns?.currency ?? "XOF";

  const { error } = await supabase.from("payments").insert({
    agency_id: profile.agency_id,
    pilgrim_id: parsed.data.pilgrimId,
    amount: parsed.data.amount,
    currency,
    status: parsed.data.status,
    method: parsed.data.status === "paid" ? parsed.data.method : null,
    due_date: parsed.data.dueDate || null,
    paid_at: parsed.data.status === "paid" ? parsed.data.paidAt || null : null,
    reference: parsed.data.reference || null,
    notes: parsed.data.notes || null,
    created_by: profile.id,
  });

  if (error) {
    return { error: "Impossible d'enregistrer le paiement." };
  }

  revalidatePaymentPaths(parsed.data.pilgrimId);
  return {
    message: parsed.data.status === "paid" ? "Paiement enregistré." : "Échéance planifiée.",
  };
}

export async function markAsPaid(
  paymentId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = markAsPaidSchema.safeParse({
    method: formData.get("method"),
    paidAt: formData.get("paidAt") ?? "",
    reference: formData.get("reference") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      method: parsed.data.method,
      paid_at: parsed.data.paidAt || new Date().toISOString(),
      reference: parsed.data.reference || null,
    })
    .eq("id", paymentId)
    .eq("status", "scheduled")
    .select("pilgrim_id")
    .single();

  if (error || !payment) {
    // Idempotence : une resoumission (double-clic, requête rejouée par le
    // réseau) ne doit pas afficher une erreur si le paiement est déjà confirmé.
    const { data: existing } = await supabase
      .from("payments")
      .select("pilgrim_id, status")
      .eq("id", paymentId)
      .single();

    if (existing?.status === "paid") {
      revalidatePaymentPaths(existing.pilgrim_id);
      return { message: "Paiement confirmé." };
    }

    return { error: "Impossible de confirmer le paiement." };
  }

  revalidatePaymentPaths(payment.pilgrim_id);
  return { message: "Paiement confirmé." };
}

export async function cancelPayment(paymentId: string) {
  const supabase = await createClient();
  const { data: payment } = await supabase
    .from("payments")
    .update({ status: "cancelled" })
    .eq("id", paymentId)
    .select("pilgrim_id")
    .single();

  revalidatePaymentPaths(payment?.pilgrim_id);
}

export async function deleteScheduledPayment(paymentId: string) {
  const supabase = await createClient();
  const { data: payment } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
    .eq("status", "scheduled")
    .select("pilgrim_id")
    .single();

  revalidatePaymentPaths(payment?.pilgrim_id);
}
