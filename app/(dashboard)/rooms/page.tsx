import Link from "next/link";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";

export const dynamic = "force-dynamic";

export default async function RoomsPage() {
  const supabase = await createClient();

  const [{ data: campaigns }, { data: hotels }, { data: rooms }, { data: assignments }] = await Promise.all([
    supabase.from("campaigns").select("id, name, type").order("start_date", { ascending: false }),
    supabase.from("hotels").select("id, campaign_id"),
    supabase.from("rooms").select("id, hotel_id, capacity"),
    supabase.from("room_assignments").select("id, hotel_id"),
  ]);

  const hotelsByCampaign = new Map<string, number>();
  const campaignByHotel = new Map<string, string>();
  for (const hotel of hotels ?? []) {
    hotelsByCampaign.set(hotel.campaign_id, (hotelsByCampaign.get(hotel.campaign_id) ?? 0) + 1);
    campaignByHotel.set(hotel.id, hotel.campaign_id);
  }

  const capacityByCampaign = new Map<string, number>();
  const roomsByCampaign = new Map<string, number>();
  for (const room of rooms ?? []) {
    const campaignId = campaignByHotel.get(room.hotel_id);
    if (!campaignId) continue;
    capacityByCampaign.set(campaignId, (capacityByCampaign.get(campaignId) ?? 0) + room.capacity);
    roomsByCampaign.set(campaignId, (roomsByCampaign.get(campaignId) ?? 0) + 1);
  }

  const occupiedByCampaign = new Map<string, number>();
  for (const assignment of assignments ?? []) {
    const campaignId = campaignByHotel.get(assignment.hotel_id);
    if (!campaignId) continue;
    occupiedByCampaign.set(campaignId, (occupiedByCampaign.get(campaignId) ?? 0) + 1);
  }

  const campaignsWithHotels = (campaigns ?? []).filter((c) => (hotelsByCampaign.get(c.id) ?? 0) > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Chambres</h1>
        <p className="text-sm text-muted-foreground">
          Hôtels et affectations par campagne. Gérez le détail depuis l&apos;onglet « Hébergement » de
          chaque campagne.
        </p>
      </div>

      {campaignsWithHotels.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Building2 className="size-8" />
            <p className="text-sm font-medium text-foreground">Aucun hôtel pour l&apos;instant</p>
            <p className="max-w-sm text-sm">
              Ouvrez une campagne puis son onglet « Hébergement » pour ajouter un hôtel et ses chambres.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaignsWithHotels.map((campaign) => {
            const capacity = capacityByCampaign.get(campaign.id) ?? 0;
            const occupied = occupiedByCampaign.get(campaign.id) ?? 0;
            return (
              <Link key={campaign.id} href={`/campaigns/${campaign.id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                        <Building2 className="size-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium">{campaign.name}</p>
                        <p className="text-xs text-muted-foreground">{CAMPAIGN_TYPE_LABELS[campaign.type]}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {hotelsByCampaign.get(campaign.id) ?? 0} hôtel(s) · {roomsByCampaign.get(campaign.id) ?? 0}{" "}
                      chambre(s) · {occupied}/{capacity} occupées
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
