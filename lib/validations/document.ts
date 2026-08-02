import { z } from "zod";

export const DOCUMENT_TYPES = [
  "passeport",
  "visa",
  "photo",
  "vaccins",
  "billet",
  "contrat",
  "autre",
] as const;

export const documentSchema = z.object({
  pilgrimId: z.string().uuid(),
  type: z.enum(DOCUMENT_TYPES),
  filePath: z.string().min(1),
  fileName: z.string().min(1).max(255),
  fileSize: z.coerce.number().int().nonnegative().optional(),
  mimeType: z.string().max(120).optional().or(z.literal("")),
  expiryDate: z.string().optional().or(z.literal("")),
});

export type DocumentFormValues = z.infer<typeof documentSchema>;

export const reviewDocumentSchema = z
  .object({
    status: z.enum(["valide", "rejete"] as const),
    rejectionReason: z.string().trim().max(500).optional().or(z.literal("")),
  })
  .refine((data) => data.status !== "rejete" || !!data.rejectionReason, {
    message: "Indiquez le motif du rejet",
    path: ["rejectionReason"],
  });
