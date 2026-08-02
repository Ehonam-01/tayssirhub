import { z } from "zod";

export const CAMPAIGN_TYPES = ["hajj", "omra", "ramadan", "autre"] as const;
export const CAMPAIGN_STATUSES = ["draft", "open", "full", "closed", "completed"] as const;
export const CURRENCIES = ["XOF", "XAF", "EUR", "USD", "MAD"] as const;

export const campaignSchema = z
  .object({
    name: z.string().trim().min(2, "Nom trop court").max(120),
    type: z.enum(CAMPAIGN_TYPES),
    status: z.enum(CAMPAIGN_STATUSES),
    startDate: z.string().optional().or(z.literal("")),
    endDate: z.string().optional().or(z.literal("")),
    price: z.coerce.number().nonnegative("Le prix ne peut pas être négatif").optional(),
    currency: z.enum(CURRENCIES),
    quota: z.coerce.number().int().positive("Le quota doit être positif").optional(),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.startDate <= data.endDate,
    { message: "La date de fin doit être après la date de début", path: ["endDate"] },
  );

export type CampaignFormValues = z.infer<typeof campaignSchema>;
