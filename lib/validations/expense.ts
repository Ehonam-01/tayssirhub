import { z } from "zod";

export const EXPENSE_CATEGORIES = [
  "hebergement",
  "transport",
  "vols",
  "visas",
  "guides",
  "restauration",
  "marketing",
  "salaires",
  "autre",
] as const;

// Valeur de substitution pour le Select "campagne" : un <Select> base-ui ne
// peut pas avoir une SelectItem avec value="" (confondu avec "non sélectionné").
export const NO_CAMPAIGN_VALUE = "none";

export const expenseSchema = z.object({
  campaignId: z.string().optional().or(z.literal("")),
  category: z.enum(EXPENSE_CATEGORIES),
  label: z.string().trim().min(1, "Le libellé est requis").max(200),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  currency: z.string().trim().min(1, "La devise est requise").max(10),
  expenseDate: z.string().optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
