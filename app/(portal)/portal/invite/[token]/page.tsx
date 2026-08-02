import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InviteClaimForm } from "@/components/portal/invite-claim-form";

export const dynamic = "force-dynamic";

export default async function PortalInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Retour du clic sur le lien magique : une session existe déjà, il ne reste
  // qu'à lier ce compte au pèlerin visé par le token.
  if (user) {
    const { error } = await supabase.rpc("claim_pilgrim_portal_access", { p_token: token });
    if (!error) redirect("/portal");

    return (
      <Card>
        <CardHeader>
          <CardTitle>Lien d&apos;invitation invalide</CardTitle>
          <CardDescription>
            Ce lien n&apos;est plus valide ou est déjà associé à un autre compte. Demandez un
            nouveau lien à votre agence.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { data: invite } = await supabase
    .rpc("get_portal_invite_pilgrim_name", { p_token: token })
    .maybeSingle();

  if (!invite || !invite.email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lien d&apos;invitation invalide</CardTitle>
          <CardDescription>
            Ce lien a expiré, a déjà été utilisé, ou le dossier n&apos;a pas d&apos;email
            enregistré. Contactez votre agence pour un nouveau lien.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activer mon portail</CardTitle>
        <CardDescription>Confirmez votre email pour accéder à votre dossier.</CardDescription>
      </CardHeader>
      <CardContent>
        <InviteClaimForm token={token} firstName={invite.first_name} email={invite.email} />
      </CardContent>
    </Card>
  );
}
