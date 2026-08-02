import { z } from "zod";
import { CRM_STAGES } from "@/lib/crm-labels";

export const PILGRIM_GENDERS = ["homme", "femme"] as const;
export const PILGRIM_STATUSES = [
  "prospect",
  "inscrit",
  "dossier_incomplet",
  "dossier_complet",
  "confirme",
  "parti",
  "revenu",
  "annule",
] as const;

export const pilgrimSchema = z.object({
  firstName: z.string().trim().min(1, "Prénom requis").max(80),
  lastName: z.string().trim().min(1, "Nom requis").max(80),
  gender: z.enum(PILGRIM_GENDERS).optional(),
  birthDate: z.string().optional().or(z.literal("")),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  profession: z.string().trim().max(120).optional().or(z.literal("")),
  address: z.string().trim().max(240).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Adresse email invalide").optional().or(z.literal("")),
  emergencyContactName: z.string().trim().max(120).optional().or(z.literal("")),
  emergencyContactPhone: z.string().trim().max(40).optional().or(z.literal("")),
  campaignId: z.string().uuid().optional().or(z.literal("")),
  guideId: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(PILGRIM_STATUSES),
  crmStage: z.enum(CRM_STAGES),
  packagePrice: z.coerce.number().nonnegative("Le prix ne peut pas être négatif").optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type PilgrimFormValues = z.infer<typeof pilgrimSchema>;
