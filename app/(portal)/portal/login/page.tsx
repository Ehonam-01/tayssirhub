import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PortalLoginForm } from "@/components/portal/portal-login-form";

export default function PortalLoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion au portail</CardTitle>
        <CardDescription>
          Consultez votre dossier : paiements, documents, hébergement, vol et guide.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PortalLoginForm />
      </CardContent>
    </Card>
  );
}
