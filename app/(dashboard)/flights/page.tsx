import Link from "next/link";
import { Plane } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";
import { FLIGHT_DIRECTION_LABELS } from "@/lib/flight-labels";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

const DIRECTION_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  aller: "default",
  retour: "secondary",
  interne: "outline",
};

export default async function FlightsPage() {
  const supabase = await createClient();

  const [{ data: campaigns }, { data: flights }] = await Promise.all([
    supabase.from("campaigns").select("id, name, type").order("start_date", { ascending: false }),
    supabase
      .from("flights")
      .select("*")
      .order("departure_at", { ascending: true }),
  ]);

  const flightsByCampaign = new Map<string, typeof flights>();
  for (const flight of flights ?? []) {
    const list = flightsByCampaign.get(flight.campaign_id) ?? [];
    list.push(flight);
    flightsByCampaign.set(flight.campaign_id, list);
  }

  const campaignsWithFlights = (campaigns ?? []).filter((c) => (flightsByCampaign.get(c.id)?.length ?? 0) > 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Vols</h1>
        <p className="text-sm text-muted-foreground">
          Vols par campagne. Gérez le détail depuis l&apos;onglet « Vols » de chaque campagne.
        </p>
      </div>

      {campaignsWithFlights.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <Plane className="size-8" />
            <p className="text-sm font-medium text-foreground">Aucun vol pour l&apos;instant</p>
            <p className="max-w-sm text-sm">
              Ouvrez une campagne puis son onglet « Vols » pour ajouter un vol aller ou retour.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {campaignsWithFlights.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="flex flex-col gap-3">
                <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                  <p className="text-sm font-medium">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">{CAMPAIGN_TYPE_LABELS[campaign.type]}</p>
                </Link>
                <div className="flex flex-col gap-1.5">
                  {flightsByCampaign.get(campaign.id)?.map((flight) => (
                    <div
                      key={flight.id}
                      className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/60 px-2.5 py-1.5 text-sm"
                    >
                      <Badge variant={DIRECTION_VARIANT[flight.direction]}>
                        {FLIGHT_DIRECTION_LABELS[flight.direction]}
                      </Badge>
                      <span className="text-muted-foreground">
                        {[flight.airline, flight.flight_number].filter(Boolean).join(" · ") || "—"} ·{" "}
                        {flight.departure_airport ?? "—"} → {flight.arrival_airport ?? "—"} ·{" "}
                        {flight.departure_at ? formatDate(flight.departure_at, "d MMM yyyy HH:mm") : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
