"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import type { ActionState } from "@/lib/actions/types";

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Email ou mot de passe incorrect." };
  }

  redirect("/");
}

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { full_name: parsed.data.fullName } },
  });

  if (error) {
    // Visible dans les logs Vercel (Functions) : indispensable pour
    // diagnostiquer les échecs non mappés ci-dessous.
    console.error("[signup] Supabase auth error", { code: error.code, status: error.status, message: error.message });
    return { error: signupErrorMessage(error.code, error.message) };
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return {
    message: "Compte créé. Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.",
  };
}

function signupErrorMessage(code: string | undefined, message: string): string {
  switch (code) {
    case "user_already_exists":
    case "email_exists":
      return "Un compte existe déjà avec cet email.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Trop de tentatives d'inscription. Patientez quelques minutes puis réessayez.";
    case "email_address_invalid":
      return "Cette adresse email n'est pas acceptée. Utilisez une autre adresse.";
    case "weak_password":
      return "Mot de passe trop faible. Choisissez-en un plus long ou plus complexe.";
    case "signup_disabled":
    case "email_provider_disabled":
      return "Les inscriptions sont temporairement fermées.";
  }
  if (message === "User already registered") return "Un compte existe déjà avec cet email.";
  if (/sending confirmation email/i.test(message)) {
    return "Le compte n'a pas pu être créé : l'email de confirmation n'a pas pu être envoyé. Réessayez plus tard.";
  }
  return "Impossible de créer le compte. Réessayez.";
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
