"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validations/auth";
import { slugify } from "@/lib/slug";
import type { ActionState } from "@/lib/actions/types";

export async function createAgency(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = onboardingSchema.safeParse({
    agencyName: formData.get("agencyName"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.rpc("create_agency_with_owner", {
    agency_name: parsed.data.agencyName,
    agency_slug: slugify(parsed.data.agencyName),
  });

  if (error) {
    return { error: "Impossible de créer l'agence. Réessayez." };
  }

  redirect("/dashboard");
}
