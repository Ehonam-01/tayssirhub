import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Nom trop court"),
  email: z.string().trim().email("Adresse email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export const onboardingSchema = z.object({
  agencyName: z.string().trim().min(2, "Nom trop court").max(120),
});
