"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function InviteClaimForm({
  token,
  firstName,
  email,
}: {
  token: string;
  firstName: string;
  email: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleClick() {
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/portal/auth/callback?next=/portal/invite/${token}`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  const maskedEmail = email.replace(/^(.).*(@.*)$/, "$1***$2");

  if (status === "sent") {
    return (
      <p className="text-sm text-muted-foreground">
        Un lien de connexion a été envoyé à <strong>{maskedEmail}</strong>. Ouvrez-le depuis cet
        appareil pour activer votre portail.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Bonjour {firstName}, nous allons vous envoyer un lien de connexion à{" "}
        <strong>{maskedEmail}</strong>.
      </p>
      {status === "error" && (
        <p className="text-sm text-destructive">Impossible d&apos;envoyer le lien. Réessayez.</p>
      )}
      <Button onClick={handleClick} disabled={status === "sending"} className="w-full">
        {status === "sending" ? "Envoi..." : "Recevoir mon lien de connexion"}
      </Button>
    </div>
  );
}
