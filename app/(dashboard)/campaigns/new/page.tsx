import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { createCampaign } from "@/lib/actions/campaigns";

export default function NewCampaignPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Nouvelle campagne</h1>
        <p className="text-sm text-muted-foreground">Créez un nouveau voyage Hajj, Oumra ou Ramadan.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Vous pourrez modifier ces informations à tout moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignForm action={createCampaign} submitLabel="Créer la campagne" />
        </CardContent>
      </Card>
    </div>
  );
}
