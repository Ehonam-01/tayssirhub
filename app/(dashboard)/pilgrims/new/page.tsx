import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PilgrimForm } from "@/components/pilgrims/pilgrim-form";
import { createPilgrim } from "@/lib/actions/pilgrims";
import { createClient } from "@/lib/supabase/server";

export default async function NewPilgrimPage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string }>;
}) {
  const { campaignId } = await searchParams;
  const supabase = await createClient();
  const [{ data: campaigns }, { data: guides }] = await Promise.all([
    supabase.from("campaigns").select("id, name").order("start_date", { ascending: false }),
    supabase.from("guides").select("id, full_name").order("full_name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Nouveau pèlerin</h1>
        <p className="text-sm text-muted-foreground">Créez une nouvelle fiche pèlerin.</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Les champs marqués sont obligatoires.</CardDescription>
        </CardHeader>
        <CardContent>
          <PilgrimForm
            action={createPilgrim}
            campaigns={campaigns ?? []}
            guides={guides ?? []}
            defaultCampaignId={campaignId}
            submitLabel="Créer la fiche"
          />
        </CardContent>
      </Card>
    </div>
  );
}
