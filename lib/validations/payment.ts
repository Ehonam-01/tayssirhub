import { z } from "zod";

export const PAYMENT_METHODS = ["especes", "mobile_money", "virement", "stripe", "cheque"] as const;
export const CREATABLE_PAYMENT_STATUSES = ["scheduled", "paid"] as const;

export const paymentSchema = z
  .object({
    pilgrimId: z.string().uuid(),
    amount: z.coerce.number().positive("Le montant doit être positif"),
    status: z.enum(CREATABLE_PAYMENT_STATUSES),
    method: z.enum(PAYMENT_METHODS).optional(),
    dueDate: z.string().optional().or(z.literal("")),
    paidAt: z.string().optional().or(z.literal("")),
    reference: z.string().trim().max(120).optional().or(z.literal("")),
    notes: z.string().trim().max(1000).optional().or(z.literal("")),
  })
  .refine((data) => data.status !== "paid" || !!data.method, {
    message: "Choisissez un mode de paiement",
    path: ["method"],
  });

export type PaymentFormValues = z.infer<typeof paymentSchema>;

export const markAsPaidSchema = z.object({
  method: z.enum(PAYMENT_METHODS),
  paidAt: z.string().optional().or(z.literal("")),
  reference: z.string().trim().max(120).optional().or(z.literal("")),
});
