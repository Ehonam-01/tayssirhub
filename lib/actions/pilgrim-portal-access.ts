"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";

export interface InvitePortalResult {
  error?: string;
  inviteUrl?: string;
}

export async function invitePilgrimToPortal(pilgrimId: string): Promise<InvitePortalResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();

  const { data: pilgrim } = await supabase
    .from("pilgrims")
    .select("email")
    .eq("id", pilgrimId)
    .maybeSingle();

  if (!pilgrim) return { error: "Pèlerin introuvable." };
  if (!pilgrim.email) {
    return { error: "Ajoutez un email au dossier avant d'inviter ce pèlerin au portail." };
  }

  const { data: existing } = await supabase
    .from("pilgrim_portal_access")
    .select("claimed_at")
    .eq("pilgrim_id", pilgrimId)
    .maybeSingle();

  if (existing?.claimed_at) {
    return { error: "Ce pèlerin a déjà activé son portail." };
  }

  // Régénéré à chaque invitation (y compris en cas de ré-invitation d'un lien
  // perdu) : le upsert ne touche pas auth_user_id/claimed_at, donc jamais de
  // risque de déconnecter un pèlerin déjà actif (bloqué juste au-dessus).
  const inviteToken = crypto.randomUUID();

  const { error } = await supabase.from("pilgrim_portal_access").upsert(
    {
      pilgrim_id: pilgrimId,
      invite_token: inviteToken,
      invited_by: profile.id,
      invited_at: new Date().toISOString(),
    },
    { onConflict: "pilgrim_id" },
  );

  if (error) return { error: "Impossible de créer l'invitation." };

  revalidatePath(`/pilgrims/${pilgrimId}`);
  return { inviteUrl: `/portal/invite/${inviteToken}` };
}
