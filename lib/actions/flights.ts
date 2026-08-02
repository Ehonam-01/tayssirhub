"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { flightSchema } from "@/lib/validations/flight";
import type { ActionState } from "@/lib/actions/types";

function revalidateFlightPaths(campaignId?: string | null) {
  if (campaignId) revalidatePath(`/campaigns/${campaignId}`);
  revalidatePath("/flights");
}

function parseFlightForm(formData: FormData) {
  return flightSchema.safeParse({
    direction: formData.get("direction"),
    airline: formData.get("airline") ?? "",
    flightNumber: formData.get("flightNumber") ?? "",
    departureAirport: formData.get("departureAirport") ?? "",
    arrivalAirport: formData.get("arrivalAirport") ?? "",
    departureAt: formData.get("departureAt") ?? "",
    arrivalAt: formData.get("arrivalAt") ?? "",
    layovers: formData.get("layovers") ?? "",
    baggageAllowance: formData.get("baggageAllowance") ?? "",
    notes: formData.get("notes") ?? "",
  });
}

export async function createFlight(
  campaignId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseFlightForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Session invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("flights").insert({
    agency_id: profile.agency_id,
    campaign_id: campaignId,
    direction: parsed.data.direction,
    airline: parsed.data.airline || null,
    flight_number: parsed.data.flightNumber || null,
    departure_airport: parsed.data.departureAirport || null,
    arrival_airport: parsed.data.arrivalAirport || null,
    departure_at: parsed.data.departureAt || null,
    arrival_at: parsed.data.arrivalAt || null,
    layovers: parsed.data.layovers || null,
    baggage_allowance: parsed.data.baggageAllowance || null,
    notes: parsed.data.notes || null,
  });

  if (error) return { error: "Impossible de créer le vol." };

  revalidateFlightPaths(campaignId);
  return { message: "Vol ajouté." };
}

export async function updateFlight(
  flightId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parseFlightForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { data: flight, error } = await supabase
    .from("flights")
    .update({
      direction: parsed.data.direction,
      airline: parsed.data.airline || null,
      flight_number: parsed.data.flightNumber || null,
      departure_airport: parsed.data.departureAirport || null,
      arrival_airport: parsed.data.arrivalAirport || null,
      departure_at: parsed.data.departureAt || null,
      arrival_at: parsed.data.arrivalAt || null,
      layovers: parsed.data.layovers || null,
      baggage_allowance: parsed.data.baggageAllowance || null,
      notes: parsed.data.notes || null,
    })
    .eq("id", flightId)
    .select("campaign_id")
    .single();

  if (error || !flight) return { error: "Impossible de modifier le vol." };

  revalidateFlightPaths(flight.campaign_id);
  return { message: "Vol modifié." };
}

export async function deleteFlight(flightId: string) {
  const supabase = await createClient();
  const { data: flight } = await supabase
    .from("flights")
    .delete()
    .eq("id", flightId)
    .select("campaign_id")
    .single();
  revalidateFlightPaths(flight?.campaign_id);
}
