import { z } from "zod";

export const FLIGHT_DIRECTIONS = ["aller", "retour", "interne"] as const;

export const flightSchema = z.object({
  direction: z.enum(FLIGHT_DIRECTIONS),
  airline: z.string().trim().max(120).optional().or(z.literal("")),
  flightNumber: z.string().trim().max(40).optional().or(z.literal("")),
  departureAirport: z.string().trim().max(120).optional().or(z.literal("")),
  arrivalAirport: z.string().trim().max(120).optional().or(z.literal("")),
  departureAt: z.string().optional().or(z.literal("")),
  arrivalAt: z.string().optional().or(z.literal("")),
  layovers: z.string().trim().max(240).optional().or(z.literal("")),
  baggageAllowance: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type FlightFormValues = z.infer<typeof flightSchema>;
