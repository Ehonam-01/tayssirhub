"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { campaignSchema } from "@/lib/validations/campaign";
import type { ActionState } from "@/lib/actions/types";

function parseCampaignForm(formData: FormData) {
  const price = formData.get("price");
  const quota = formData.get("quota");

  return campaignSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    status: formData.get("status"),
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
    price: price ? price : undefined,
    currency: formData.get("currency"),
    quota: quota ? quota : undefined,
  });
}

export async function createCampaign(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCampaignForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) redirect("/onboarding");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({
      agency_id: profile.agency_id,
      name: parsed.data.name,
      type: parsed.data.type,
      status: parsed.data.status,
      start_date: parsed.data.startDate || null,
      end_date: parsed.data.endDate || null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency,
      quota: parsed.data.quota ?? null,
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Impossible de créer la campagne." };
  }

  revalidatePath("/campaigns");
  redirect(`/campaigns/${data.id}`);
}

export async function updateCampaign(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseCampaignForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({
      name: parsed.data.name,
      type: parsed.data.type,
      status: parsed.data.status,
      start_date: parsed.data.startDate || null,
      end_date: parsed.data.endDate || null,
      price: parsed.data.price ?? null,
      currency: parsed.data.currency,
      quota: parsed.data.quota ?? null,
    })
    .eq("id", id);

  if (error) {
    return { error: "Impossible d'enregistrer les modifications." };
  }

  revalidatePath(`/campaigns/${id}`);
  revalidatePath("/campaigns");
  return { message: "Modifications enregistrées." };
}

export async function deleteCampaign(id: string) {
  const supabase = await createClient();
  await supabase.from("campaigns").delete().eq("id", id);
  revalidatePath("/campaigns");
  redirect("/campaigns");
}
