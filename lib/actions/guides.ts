"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { guideSchema } from "@/lib/validations/guide";
import type { ActionState } from "@/lib/actions/types";

function parseGuideForm(formData: FormData) {
  return guideSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

export async function createGuide(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseGuideForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) redirect("/onboarding");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("guides")
    .insert({
      agency_id: profile.agency_id,
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Impossible de créer le guide." };

  revalidatePath("/guides");
  redirect(`/guides/${data.id}`);
}

export async function updateGuide(
  guideId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseGuideForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("guides")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      email: parsed.data.email || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", guideId);

  if (error) return { error: "Impossible de modifier le guide." };

  revalidatePath(`/guides/${guideId}`);
  revalidatePath("/guides");
  return { message: "Guide modifié." };
}

export async function deleteGuide(guideId: string) {
  const supabase = await createClient();
  await supabase.from("guides").delete().eq("id", guideId);
  revalidatePath("/guides");
  redirect("/guides");
}
