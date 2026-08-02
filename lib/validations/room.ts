import { z } from "zod";

export const ROOM_TYPES = [
  "individuelle",
  "double",
  "triple",
  "quadruple",
  "quintuple",
  "autre",
] as const;

export const hotelSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  stars: z.coerce.number().int().min(1).max(5).optional(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type HotelFormValues = z.infer<typeof hotelSchema>;

export const roomSchema = z.object({
  number: z.string().trim().min(1, "Numéro requis").max(40),
  floor: z.string().trim().max(40).optional().or(z.literal("")),
  type: z.enum(ROOM_TYPES),
  capacity: z.coerce.number().int().positive("La capacité doit être positive"),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type RoomFormValues = z.infer<typeof roomSchema>;
