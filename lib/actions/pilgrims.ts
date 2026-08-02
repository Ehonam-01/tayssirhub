"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { pilgrimSchema } from "@/lib/validations/pilgrim";
import type { ActionState } from "@/lib/actions/types";

function emptyToNull(value?: string) {
  return value ? value : null;
}

function parsePilgrimForm(formData: FormData) {
  const packagePrice = formData.get("packagePrice");
  return pilgrimSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    gender: formData.get("gender") || undefined,
    birthDate: formData.get("birthDate") ?? "",
    nationality: formData.get("nationality") ?? "",
    profession: formData.get("profession") ?? "",
    address: formData.get("address") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    emergencyContactName: formData.get("emergencyContactName") ?? "",
    emergencyContactPhone: formData.get("emergencyContactPhone") ?? "",
    campaignId: formData.get("campaignId") ?? "",
    guideId: formData.get("guideId") ?? "",
    status: formData.get("status"),
    crmStage: formData.get("crmStage"),
    packagePrice: packagePrice ? packagePrice : undefined,
    notes: formData.get("notes") ?? "",
  });
}

export async function createPilgrim(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePilgrimForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) redirect("/onboarding");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pilgrims")
    .insert({
      agency_id: profile.agency_id,
      campaign_id: emptyToNull(parsed.data.campaignId),
      guide_id: emptyToNull(parsed.data.guideId),
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      gender: parsed.data.gender ?? null,
      birth_date: emptyToNull(parsed.data.birthDate),
      nationality: emptyToNull(parsed.data.nationality),
      profession: emptyToNull(parsed.data.profession),
      address: emptyToNull(parsed.data.address),
      phone: emptyToNull(parsed.data.phone),
      email: emptyToNull(parsed.data.email),
      emergency_contact_name: emptyToNull(parsed.data.emergencyContactName),
      emergency_contact_phone: emptyToNull(parsed.data.emergencyContactPhone),
      status: parsed.data.status,
      crm_stage: parsed.data.crmStage,
      package_price: parsed.data.packagePrice ?? null,
      notes: emptyToNull(parsed.data.notes),
      created_by: profile.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "Impossible de créer la fiche pèlerin." };
  }

  revalidatePath("/pilgrims");
  redirect(`/pilgrims/${data.id}`);
}

export async function updatePilgrim(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePilgrimForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("pilgrims")
    .update({
      campaign_id: emptyToNull(parsed.data.campaignId),
      guide_id: emptyToNull(parsed.data.guideId),
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      gender: parsed.data.gender ?? null,
      birth_date: emptyToNull(parsed.data.birthDate),
      nationality: emptyToNull(parsed.data.nationality),
      profession: emptyToNull(parsed.data.profession),
      address: emptyToNull(parsed.data.address),
      phone: emptyToNull(parsed.data.phone),
      email: emptyToNull(parsed.data.email),
      emergency_contact_name: emptyToNull(parsed.data.emergencyContactName),
      emergency_contact_phone: emptyToNull(parsed.data.emergencyContactPhone),
      status: parsed.data.status,
      crm_stage: parsed.data.crmStage,
      package_price: parsed.data.packagePrice ?? null,
      notes: emptyToNull(parsed.data.notes),
    })
    .eq("id", id);

  if (error) {
    return { error: "Impossible d'enregistrer les modifications." };
  }

  revalidatePath(`/pilgrims/${id}`);
  revalidatePath("/pilgrims");
  return { message: "Modifications enregistrées." };
}

export async function deletePilgrim(id: string) {
  const supabase = await createClient();
  await supabase.from("pilgrims").delete().eq("id", id);
  revalidatePath("/pilgrims");
  redirect("/pilgrims");
}

export async function updateCrmStage(
  pilgrimId: string,
  stage: string,
): Promise<{ error?: string }> {
  const parsed = pilgrimSchema.shape.crmStage.safeParse(stage);
  if (!parsed.success) return { error: "Étape invalide." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pilgrims")
    .update({ crm_stage: parsed.data })
    .eq("id", pilgrimId);

  if (error) return { error: "Impossible de mettre à jour l'étape." };

  revalidatePath("/crm");
  revalidatePath(`/pilgrims/${pilgrimId}`);
  return {};
}
