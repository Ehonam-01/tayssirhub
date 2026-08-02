import { AddFlightDialog } from "@/components/flights/add-flight-dialog";
import { FlightCard } from "@/components/flights/flight-card";
import type { Database } from "@/lib/types/database";

type Flight = Database["public"]["Tables"]["flights"]["Row"];

export function CampaignFlightsPanel({
  campaignId,
  flights,
}: {
  campaignId: string;
  flights: Flight[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{flights.length} vol(s)</p>
        <AddFlightDialog campaignId={campaignId} />
      </div>

      {flights.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aucun vol pour cette campagne pour l&apos;instant.
        </p>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {flights.map((flight) => (
            <FlightCard key={flight.id} flight={flight} />
          ))}
        </div>
      )}
    </div>
  );
}
