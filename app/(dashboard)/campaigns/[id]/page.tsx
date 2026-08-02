import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignForm } from "@/components/campaigns/campaign-form";
import { CampaignDeleteButton } from "@/components/campaigns/campaign-delete-button";
import { CampaignStatusBadge, CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { CampaignRoomsPanel } from "@/components/rooms/campaign-rooms-panel";
import { CampaignFlightsPanel } from "@/components/flights/campaign-flights-panel";
import { CampaignExpensesPanel } from "@/components/accounting/campaign-expenses-panel";
import { updateCampaign } from "@/lib/actions/campaigns";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase.from("campaigns").select("*").eq("id", id).single();
  if (!campaign) notFound();

  const [{ data: pilgrims }, { data: hotels }, { data: flights }, { data: expenses }] = await Promise.all([
    supabase
      .from("pilgrims")
      .select("id, first_name, last_name, status")
      .eq("campaign_id", id)
      .order("last_name", { ascending: true }),
    supabase.from("hotels").select("*").eq("campaign_id", id).order("created_at", { ascending: true }),
    supabase.from("flights").select("*").eq("campaign_id", id).order("departure_at", { ascending: true }),
    supabase.from("expenses").select("*").eq("campaign_id", id).order("expense_date", { ascending: false }),
  ]);

  const pilgrimIds = (pilgrims ?? []).map((pilgrim) => pilgrim.id);
  const { data: revenuePayments } =
    pilgrimIds.length > 0
      ? await supabase.from("payments").select("amount, currency").eq("status", "paid").in("pilgrim_id", pilgrimIds)
      : { data: [] };

  const hotelIds = (hotels ?? []).map((hotel) => hotel.id);
  const [{ data: rooms }, { data: assignments }] =
    hotelIds.length > 0
      ? await Promise.all([
          supabase.from("rooms").select("*").in("hotel_id", hotelIds).order("number", { ascending: true }),
          supabase
            .from("room_assignments")
            .select("id, room_id, hotel_id, pilgrim_id, pilgrims(first_name, last_name)")
            .in("hotel_id", hotelIds),
        ])
      : [{ data: [] }, { data: [] }];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl font-semibold">{campaign.name}</h1>
            <CampaignStatusBadge status={campaign.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {CAMPAIGN_TYPE_LABELS[campaign.type]} · {pilgrims?.length ?? 0} pèlerin(s) inscrit(s)
          </p>
        </div>
        <CampaignDeleteButton id={campaign.id} name={campaign.name} />
      </div>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="pilgrims">Pèlerins inscrits</TabsTrigger>
          <TabsTrigger value="rooms">Hébergement</TabsTrigger>
          <TabsTrigger value="flights">Vols</TabsTrigger>
          <TabsTrigger value="accounting">Comptabilité</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="mt-4">
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Modifier la campagne</CardTitle>
              <CardDescription>Les modifications sont visibles immédiatement par votre équipe.</CardDescription>
            </CardHeader>
            <CardContent>
              <CampaignForm
                action={updateCampaign.bind(null, campaign.id)}
                defaultValues={campaign}
                submitLabel="Enregistrer"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pilgrims" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pèlerins inscrits</CardTitle>
                <CardDescription>Pèlerins rattachés à cette campagne.</CardDescription>
              </div>
              <Link href={`/pilgrims/new?campaignId=${campaign.id}`} className={buttonVariants()}>
                <Plus /> Ajouter un pèlerin
              </Link>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {!pilgrims?.length && (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  Aucun pèlerin rattaché pour l&apos;instant.
                </p>
              )}
              {pilgrims?.map((pilgrim) => (
                <Link
                  key={pilgrim.id}
                  href={`/pilgrims/${pilgrim.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
                >
                  <span className="text-sm font-medium">
                    {pilgrim.first_name} {pilgrim.last_name}
                  </span>
                  <PilgrimStatusBadge status={pilgrim.status} />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="mt-4">
          <CampaignRoomsPanel
            campaignId={campaign.id}
            hotels={hotels ?? []}
            rooms={rooms ?? []}
            assignments={assignments ?? []}
            pilgrims={pilgrims ?? []}
          />
        </TabsContent>

        <TabsContent value="flights" className="mt-4">
          <CampaignFlightsPanel campaignId={campaign.id} flights={flights ?? []} />
        </TabsContent>

        <TabsContent value="accounting" className="mt-4">
          <CampaignExpensesPanel
            campaignId={campaign.id}
            expenses={expenses ?? []}
            revenue={revenuePayments ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
