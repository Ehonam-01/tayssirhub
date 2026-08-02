import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Échange le code PKCE reçu après le clic sur le lien magique contre une
// session (le verifier correspondant a été posé en cookie par le client
// navigateur au moment de signInWithOtp — @supabase/ssr gère ce couplage).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/portal";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
