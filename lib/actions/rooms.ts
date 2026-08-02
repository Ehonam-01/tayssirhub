"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { hotelSchema, roomSchema } from "@/lib/validations/room";
import type { ActionState } from "@/lib/actions/types";
import type { PilgrimGender } from "@/lib/types/database";

function revalidateRoomPaths(campaignId?: string | null) {
  if (campaignId) revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/rooms");
}

function parseHotelForm(formData: FormData) {
  return hotelSchema.safeParse({
    name: formData.get("name"),
    city: formData.get("city") ?? "",
    address: formData.get("address") ?? "",
    stars: formData.get("stars") || undefined,
    notes: formData.get("notes") ?? "",
  });
}

export async function createHotel(
  campaignId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseHotelForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("hotels").insert({
    agency_id: profile.agency_id,
    campaign_id: campaignId,
    name: parsed.data.name,
    city: parsed.data.city || null,
    address: parsed.data.address || null,
    stars: parsed.data.stars ?? null,
    notes: parsed.data.notes || null,
  });

  if (error) return { error: "Impossible de créer l'hôtel." };

  revalidateRoomPaths(campaignId);
  return { message: "Hôtel ajouté." };
}

export async function updateHotel(
  hotelId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseHotelForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: hotel, error } = await supabase
    .from("hotels")
    .update({
      name: parsed.data.name,
      city: parsed.data.city || null,
      address: parsed.data.address || null,
      stars: parsed.data.stars ?? null,
      notes: parsed.data.notes || null,
    })
    .eq("id", hotelId)
    .select("campaign_id")
    .single();

  if (error || !hotel) return { error: "Impossible de modifier l'hôtel." };

  revalidateRoomPaths(hotel.campaign_id);
  return { message: "Hôtel modifié." };
}

export async function deleteHotel(hotelId: string) {
  const supabase = await createClient();
  const { data: hotel } = await supabase
    .from("hotels")
    .delete()
    .eq("id", hotelId)
    .select("campaign_id")
    .single();
  revalidateRoomPaths(hotel?.campaign_id);
}

function parseRoomForm(formData: FormData) {
  return roomSchema.safeParse({
    number: formData.get("number"),
    floor: formData.get("floor") ?? "",
    type: formData.get("type"),
    capacity: formData.get("capacity"),
    notes: formData.get("notes") ?? "",
  });
}

export async function createRoom(
  hotelId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseRoomForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();
  const { data: hotel } = await supabase.from("hotels").select("campaign_id").eq("id", hotelId).single();

  const { error } = await supabase.from("rooms").insert({
    agency_id: profile.agency_id,
    hotel_id: hotelId,
    number: parsed.data.number,
    floor: parsed.data.floor || null,
    type: parsed.data.type,
    capacity: parsed.data.capacity,
    notes: parsed.data.notes || null,
  });

  if (error) return { error: "Impossible de créer la chambre." };

  revalidateRoomPaths(hotel?.campaign_id);
  return { message: "Chambre ajoutée." };
}

export async function updateRoom(
  roomId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseRoomForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: room, error } = await supabase
    .from("rooms")
    .update({
      number: parsed.data.number,
      floor: parsed.data.floor || null,
      type: parsed.data.type,
      capacity: parsed.data.capacity,
      notes: parsed.data.notes || null,
    })
    .eq("id", roomId)
    .select("hotel_id")
    .single();

  if (error || !room) return { error: "Impossible de modifier la chambre." };

  const { data: hotel } = await supabase.from("hotels").select("campaign_id").eq("id", room.hotel_id).single();
  revalidateRoomPaths(hotel?.campaign_id);
  return { message: "Chambre modifiée." };
}

export async function deleteRoom(roomId: string) {
  const supabase = await createClient();
  const { data: room } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId)
    .select("hotel_id")
    .single();

  if (room?.hotel_id) {
    const supabase2 = await createClient();
    const { data: hotel } = await supabase2.from("hotels").select("campaign_id").eq("id", room.hotel_id).single();
    revalidateRoomPaths(hotel?.campaign_id);
  }
}

export async function assignPilgrimToRoom(
  roomId: string,
  pilgrimId: string,
): Promise<{ error?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();
  const { data: room } = await supabase
    .from("rooms")
    .select("id, hotel_id, capacity")
    .eq("id", roomId)
    .single();
  if (!room) return { error: "Chambre introuvable." };

  const { data: pilgrim } = await supabase.from("pilgrims").select("gender").eq("id", pilgrimId).single();

  const { data: occupants } = await supabase
    .from("room_assignments")
    .select("pilgrim_id, pilgrims(gender)")
    .eq("room_id", roomId);

  if ((occupants?.length ?? 0) >= room.capacity) {
    return { error: "Cette chambre est déjà complète." };
  }

  const existingGender = occupants?.find((o) => o.pilgrims?.gender)?.pilgrims?.gender ?? null;
  if (existingGender && pilgrim?.gender && existingGender !== pilgrim.gender) {
    return { error: "Cette chambre est déjà occupée par des pèlerins de l'autre genre." };
  }

  // Un pèlerin n'a qu'une chambre par hôtel : on retire une éventuelle
  // affectation précédente pour ce même hôtel avant de créer la nouvelle.
  await supabase.from("room_assignments").delete().eq("hotel_id", room.hotel_id).eq("pilgrim_id", pilgrimId);

  const { error } = await supabase.from("room_assignments").insert({
    agency_id: profile.agency_id,
    room_id: roomId,
    hotel_id: room.hotel_id,
    pilgrim_id: pilgrimId,
  });

  if (error) return { error: "Impossible d'assigner ce pèlerin." };

  const { data: hotel } = await supabase.from("hotels").select("campaign_id").eq("id", room.hotel_id).single();
  revalidateRoomPaths(hotel?.campaign_id);
  revalidatePath(`/pilgrims/${pilgrimId}`);
  return {};
}

export async function unassignPilgrim(assignmentId: string) {
  const supabase = await createClient();
  const { data: assignment } = await supabase
    .from("room_assignments")
    .delete()
    .eq("id", assignmentId)
    .select("pilgrim_id, hotel_id")
    .single();

  if (!assignment) return;

  const { data: hotel } = await supabase
    .from("hotels")
    .select("campaign_id")
    .eq("id", assignment.hotel_id)
    .single();
  revalidateRoomPaths(hotel?.campaign_id);
  revalidatePath(`/pilgrims/${assignment.pilgrim_id}`);
}

export async function autoAssignRoomsForHotel(
  hotelId: string,
): Promise<{ error?: string; message?: string }> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();
  const { data: hotel } = await supabase.from("hotels").select("campaign_id").eq("id", hotelId).single();
  if (!hotel) return { error: "Hôtel introuvable." };

  const [{ data: rooms }, { data: assignments }, { data: campaignPilgrims }] = await Promise.all([
    supabase.from("rooms").select("id, capacity").eq("hotel_id", hotelId),
    supabase
      .from("room_assignments")
      .select("room_id, pilgrim_id, pilgrims(gender)")
      .eq("hotel_id", hotelId),
    supabase.from("pilgrims").select("id, gender").eq("campaign_id", hotel.campaign_id),
  ]);

  const assignedIds = new Set((assignments ?? []).map((a) => a.pilgrim_id));
  const unassigned = (campaignPilgrims ?? []).filter(
    (p): p is { id: string; gender: PilgrimGender } => !!p.gender && !assignedIds.has(p.id),
  );

  type RoomState = { id: string; capacity: number; occupied: number; gender: PilgrimGender | null };
  const roomState: RoomState[] = (rooms ?? []).map((room) => {
    const roomOccupants = (assignments ?? []).filter((a) => a.room_id === room.id);
    const gender = (roomOccupants[0]?.pilgrims?.gender as PilgrimGender | undefined) ?? null;
    return { id: room.id, capacity: room.capacity, occupied: roomOccupants.length, gender };
  });

  const toInsert: { agency_id: string; room_id: string; hotel_id: string; pilgrim_id: string }[] = [];

  for (const gender of ["homme", "femme"] as const) {
    for (const pilgrim of unassigned.filter((p) => p.gender === gender)) {
      const room = roomState.find((r) => r.occupied < r.capacity && (r.gender === null || r.gender === gender));
      if (!room) continue;
      room.occupied += 1;
      room.gender = gender;
      toInsert.push({
        agency_id: profile.agency_id,
        room_id: room.id,
        hotel_id: hotelId,
        pilgrim_id: pilgrim.id,
      });
    }
  }

  if (toInsert.length === 0) {
    return {
      message: "Aucun pèlerin à répartir (déjà assignés, genre non renseigné, ou plus de place disponible).",
    };
  }

  const { error } = await supabase.from("room_assignments").insert(toInsert);
  if (error) return { error: "Échec de la répartition automatique." };

  revalidateRoomPaths(hotel.campaign_id);
  return { message: `${toInsert.length} pèlerin(s) réparti(s) automatiquement.` };
}
