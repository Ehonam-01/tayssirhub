"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function PortalLoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Seule l'invitation (token) peut créer un compte pèlerin ; la page de
        // connexion classique n'accepte que les comptes déjà activés.
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/portal/auth/callback?next=/portal`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-muted-foreground">
        Un lien de connexion a été envoyé à <strong>{email}</strong>. Ouvrez-le depuis cet appareil
        pour accéder à votre dossier.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-destructive">
          Aucun accès portail trouvé pour cet email. Demandez un lien d&apos;invitation à votre
          agence.
        </p>
      )}
      <Button type="submit" disabled={status === "sending"} className="w-full">
        {status === "sending" ? "Envoi..." : "Recevoir mon lien de connexion"}
      </Button>
    </form>
  );
}
