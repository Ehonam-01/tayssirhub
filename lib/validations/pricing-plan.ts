import { z } from "zod";

export const PRICING_CURRENCIES = ["EUR", "USD", "XOF"] as const;

export const pricingPlanSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1, "Le slug est requis")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement"),
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  priceMonthly: z.coerce.number().nonnegative().optional().or(z.literal("")),
  priceYearly: z.coerce.number().nonnegative().optional().or(z.literal("")),
  currency: z.enum(PRICING_CURRENCIES),
  isCustomPricing: z.boolean(),
  features: z.string().trim().max(2000).optional().or(z.literal("")),
  ctaLabel: z.string().trim().min(1).max(60),
  isPopular: z.boolean(),
  hasFreeTrial: z.boolean(),
  trialDays: z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  color: z.string().trim().max(30).optional().or(z.literal("")),
  displayOrder: z.coerce.number().int(),
  isPublished: z.boolean(),
});

export type PricingPlanFormValues = z.infer<typeof pricingPlanSchema>;
