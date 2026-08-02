import { AddHotelDialog } from "@/components/rooms/add-hotel-dialog";
import { HotelCard } from "@/components/rooms/hotel-card";
import type { Database } from "@/lib/types/database";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];
type Assignment = {
  id: string;
  room_id: string;
  hotel_id: string;
  pilgrim_id: string;
  pilgrims: { first_name: string; last_name: string } | null;
};
type Pilgrim = { id: string; first_name: string; last_name: string };

export function CampaignRoomsPanel({
  campaignId,
  hotels,
  rooms,
  assignments,
  pilgrims,
}: {
  campaignId: string;
  hotels: Hotel[];
  rooms: Room[];
  assignments: Assignment[];
  pilgrims: Pilgrim[];
}) {
  const roomsByHotel = new Map<string, Room[]>();
  for (const room of rooms) {
    const list = roomsByHotel.get(room.hotel_id) ?? [];
    list.push(room);
    roomsByHotel.set(room.hotel_id, list);
  }

  const occupantsByRoom = new Map<string, { assignmentId: string; firstName: string; lastName: string }[]>();
  const assignedPilgrimIdsByHotel = new Map<string, Set<string>>();
  for (const assignment of assignments) {
    const occupants = occupantsByRoom.get(assignment.room_id) ?? [];
    occupants.push({
      assignmentId: assignment.id,
      firstName: assignment.pilgrims?.first_name ?? "?",
      lastName: assignment.pilgrims?.last_name ?? "",
    });
    occupantsByRoom.set(assignment.room_id, occupants);

    const hotelSet = assignedPilgrimIdsByHotel.get(assignment.hotel_id) ?? new Set<string>();
    hotelSet.add(assignment.pilgrim_id);
    assignedPilgrimIdsByHotel.set(assignment.hotel_id, hotelSet);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {hotels.length} hôtel(s) · {rooms.length} chambre(s)
        </p>
        <AddHotelDialog campaignId={campaignId} />
      </div>

      {hotels.length === 0 && (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Aucun hôtel pour cette campagne pour l&apos;instant.
        </p>
      )}

      {hotels.map((hotel) => {
        const assignedIds = assignedPilgrimIdsByHotel.get(hotel.id) ?? new Set<string>();
        const candidates = pilgrims
          .filter((p) => !assignedIds.has(p.id))
          .map((p) => ({ id: p.id, firstName: p.first_name, lastName: p.last_name }));

        const hotelRooms = roomsByHotel.get(hotel.id) ?? [];
        const occupantsForHotelRooms: Record<string, { assignmentId: string; firstName: string; lastName: string }[]> = {};
        for (const room of hotelRooms) {
          occupantsForHotelRooms[room.id] = occupantsByRoom.get(room.id) ?? [];
        }

        return (
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            rooms={hotelRooms}
            occupantsByRoom={occupantsForHotelRooms}
            candidates={candidates}
          />
        );
      })}
    </div>
  );
}
