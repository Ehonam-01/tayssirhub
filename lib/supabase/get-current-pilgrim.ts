import { createClient } from "@/lib/supabase/server";

// Équivalent pèlerin de getCurrentProfile() (staff). Résout l'identité en deux
// requêtes bornées par égalité explicite (jamais "select * en comptant sur la
// RLS pour ne renvoyer qu'une ligne") : un membre du staff qui ouvrirait /portal
// par erreur ne doit jamais faire planter .maybeSingle() en récupérant toutes
// les lignes de son agence.
export async function getCurrentPilgrim() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: access } = await supabase
    .from("pilgrim_portal_access")
    .select("pilgrim_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!access) return null;

  const { data: pilgrim } = await supabase
    .from("pilgrims")
    .select(
      "id, agency_id, campaign_id, guide_id, first_name, last_name, status, package_price, phone, email, campaigns(name, price, currency, start_date, end_date), guides(full_name, phone, email)",
    )
    .eq("id", access.pilgrim_id)
    .maybeSingle();

  return pilgrim;
}
