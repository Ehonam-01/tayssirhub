"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { pricingPlanSchema } from "@/lib/validations/pricing-plan";
import type { ActionState } from "@/lib/actions/types";

function parsePricingPlanForm(formData: FormData) {
  return pricingPlanSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    priceMonthly: formData.get("priceMonthly") || "",
    priceYearly: formData.get("priceYearly") || "",
    currency: formData.get("currency"),
    isCustomPricing: formData.get("isCustomPricing") === "on",
    features: formData.get("features") ?? "",
    ctaLabel: formData.get("ctaLabel"),
    isPopular: formData.get("isPopular") === "on",
    hasFreeTrial: formData.get("hasFreeTrial") === "on",
    trialDays: formData.get("trialDays") || "",
    color: formData.get("color") ?? "",
    displayOrder: formData.get("displayOrder") || "0",
    isPublished: formData.get("isPublished") === "on",
  });
}

function featuresToArray(features?: string) {
  return (features ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function revalidatePricingPaths() {
  revalidatePath("/admin/pricing");
  revalidatePath("/");
}

export async function createPricingPlan(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePricingPlanForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase.from("pricing_plans").insert({
    slug: parsed.data.slug,
    name: parsed.data.name,
    description: parsed.data.description || null,
    price_monthly: parsed.data.isCustomPricing ? null : parsed.data.priceMonthly || null,
    price_yearly: parsed.data.isCustomPricing ? null : parsed.data.priceYearly || null,
    currency: parsed.data.currency,
    is_custom_pricing: parsed.data.isCustomPricing,
    features: featuresToArray(parsed.data.features),
    cta_label: parsed.data.ctaLabel,
    is_popular: parsed.data.isPopular,
    has_free_trial: parsed.data.hasFreeTrial,
    trial_days: parsed.data.hasFreeTrial ? parsed.data.trialDays || null : null,
    color: parsed.data.color || null,
    display_order: parsed.data.displayOrder,
    is_published: parsed.data.isPublished,
  });

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug est déjà utilisé." : "Impossible de créer l'offre.",
    };
  }

  revalidatePricingPaths();
  return { message: "Offre créée." };
}

export async function updatePricingPlan(
  planId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = parsePricingPlanForm(formData);
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const supabase = await createClient();
  const { error } = await supabase
    .from("pricing_plans")
    .update({
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description || null,
      price_monthly: parsed.data.isCustomPricing ? null : parsed.data.priceMonthly || null,
      price_yearly: parsed.data.isCustomPricing ? null : parsed.data.priceYearly || null,
      currency: parsed.data.currency,
      is_custom_pricing: parsed.data.isCustomPricing,
      features: featuresToArray(parsed.data.features),
      cta_label: parsed.data.ctaLabel,
      is_popular: parsed.data.isPopular,
      has_free_trial: parsed.data.hasFreeTrial,
      trial_days: parsed.data.hasFreeTrial ? parsed.data.trialDays || null : null,
      color: parsed.data.color || null,
      display_order: parsed.data.displayOrder,
      is_published: parsed.data.isPublished,
    })
    .eq("id", planId);

  if (error) {
    return {
      error: error.code === "23505" ? "Ce slug est déjà utilisé." : "Impossible de modifier l'offre.",
    };
  }

  revalidatePricingPaths();
  return { message: "Offre modifiée." };
}

export async function deletePricingPlan(planId: string) {
  const supabase = await createClient();
  await supabase.from("pricing_plans").delete().eq("id", planId);
  revalidatePricingPaths();
}
