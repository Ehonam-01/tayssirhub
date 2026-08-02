import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";

const AUTH_PATHS = ["/login", "/signup"];
const ONBOARDING_PATH = "/onboarding";
const PORTAL_PATH = "/portal";
const ADMIN_PATH = "/admin";

function redirectTo(request: NextRequest, base: NextResponse, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const redirect = NextResponse.redirect(url);
  base.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
      global: {
        // Voir lib/supabase/server.ts : évite de lire un profiles.agency_id
        // mis en cache par le fetch étendu de Next.js.
        fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
      },
    },
  );

  // Ne jamais insérer de logique entre createServerClient et getUser() :
  // getUser() est ce qui rafraîchit/valide le token côté serveur Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isOnboardingPath = pathname.startsWith(ONBOARDING_PATH);
  const isPortalPath = pathname.startsWith(PORTAL_PATH);
  const isAdminPath = pathname.startsWith(ADMIN_PATH);

  // Le portail pèlerin gère sa propre garde d'accès page par page (public :
  // /portal/login, /portal/invite/*, /portal/auth/callback ; protégé :
  // /portal lui-même redirige vers /portal/login si besoin) — jamais la
  // logique d'onboarding staff ci-dessous, qui ne concerne que les comptes
  // d'agence.
  if (isPortalPath) {
    return supabaseResponse;
  }

  // Même logique pour /admin : un super admin dédié peut n'avoir aucune
  // agence (is_super_admin est indépendant de agency_id) — sans cette
  // exemption il tomberait dans la redirection "pas d'agence -> /onboarding"
  // ci-dessous avant même d'atteindre /admin. La garde d'accès réelle
  // (is_super_admin) est faite par app/(admin)/admin/layout.tsx.
  if (isAdminPath) {
    return supabaseResponse;
  }

  if (!user) {
    // "/" est la page de vente publique : accessible sans connexion, contrairement
    // au reste de l'app. Les visiteurs déjà connectés sont redirigés plus bas.
    if (isAuthPath || pathname === "/") return supabaseResponse;
    return redirectTo(request, supabaseResponse, "/login");
  }

  // Garde-fou : un pèlerin qui vient de faire son premier signInWithOtp a une
  // session (et, via le trigger handle_new_user, une ligne profiles vide)
  // mais n'est pas un membre du staff — sans ce contrôle, il tomberait dans
  // la redirection "pas d'agence -> /onboarding" ci-dessous et pourrait y
  // créer sa propre agence via create_agency_with_owner.
  const { data: portalAccess } = await supabase
    .from("pilgrim_portal_access")
    .select("pilgrim_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (portalAccess) {
    return redirectTo(request, supabaseResponse, "/portal");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id")
    .eq("id", user.id)
    .single();

  const hasAgency = !!profile?.agency_id;

  if (!hasAgency && !isOnboardingPath) {
    return redirectTo(request, supabaseResponse, "/onboarding");
  }

  if (hasAgency && (isAuthPath || isOnboardingPath)) {
    return redirectTo(request, supabaseResponse, "/dashboard");
  }

  if (pathname === "/") {
    return redirectTo(request, supabaseResponse, hasAgency ? "/dashboard" : "/onboarding");
  }

  return supabaseResponse;
}
