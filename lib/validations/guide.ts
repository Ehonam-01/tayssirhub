import { z } from "zod";

export const guideSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court").max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Adresse email invalide").optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type GuideFormValues = z.infer<typeof guideSchema>;
