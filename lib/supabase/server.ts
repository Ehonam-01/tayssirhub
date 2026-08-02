import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/lib/types/database";

// À appeler dans les Server Components, Server Actions et Route Handlers.
// Ne jamais réutiliser une instance entre requêtes : les cookies sont liés
// à la requête courante.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Appelé depuis un Server Component : ignoré si le middleware
            // rafraîchit déjà la session sur chaque requête.
          }
        },
      },
      global: {
        // Next.js étend `fetch` avec son propre cache ; sans ça, les GET
        // PostgREST (ex. lecture de profiles.agency_id juste après l'onboarding)
        // peuvent être servis depuis un cache obsolète.
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    },
  );
}
