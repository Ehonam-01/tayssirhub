"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";
import { PRICING_CURRENCIES } from "@/lib/validations/pricing-plan";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];

function Checkbox({
  id,
  name,
  label,
  defaultChecked,
}: {
  id: string;
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <input
        id={id}
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="size-4 rounded border-input accent-primary"
      />
      {label}
    </label>
  );
}

export function PricingPlanForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<PricingPlan>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" placeholder="professionnel" defaultValue={defaultValues?.slug ?? ""} required />
          <FieldError errors={state?.fieldErrors?.slug} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" defaultValue={defaultValues?.name ?? ""} required />
          <FieldError errors={state?.fieldErrors?.name} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={2} defaultValue={defaultValues?.description ?? ""} />
      </div>

      <Checkbox
        id="isCustomPricing"
        name="isCustomPricing"
        label="Prix sur devis (ignore les montants ci-dessous)"
        defaultChecked={defaultValues?.is_custom_pricing ?? false}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priceMonthly">Prix mensuel</Label>
          <Input
            id="priceMonthly"
            name="priceMonthly"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.price_monthly ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="priceYearly">Prix annuel</Label>
          <Input
            id="priceYearly"
            name="priceYearly"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.price_yearly ?? undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Devise</Label>
          <Select name="currency" defaultValue={defaultValues?.currency ?? "EUR"} required>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRICING_CURRENCIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="features">Fonctionnalités (une par ligne)</Label>
        <Textarea
          id="features"
          name="features"
          rows={5}
          defaultValue={(defaultValues?.features ?? []).join("\n")}
          placeholder={"Gestion des pèlerins\nSuivi des paiements\n..."}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ctaLabel">Texte du bouton</Label>
          <Input id="ctaLabel" name="ctaLabel" defaultValue={defaultValues?.cta_label ?? "Demander une démonstration"} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="displayOrder">Ordre d&apos;affichage</Label>
          <Input id="displayOrder" name="displayOrder" type="number" defaultValue={defaultValues?.display_order ?? 0} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="color">Couleur d&apos;accent (optionnel)</Label>
        <Input id="color" name="color" placeholder="#B8923E" defaultValue={defaultValues?.color ?? ""} />
      </div>

      <div className="flex flex-wrap gap-4">
        <Checkbox id="isPopular" name="isPopular" label="Offre populaire" defaultChecked={defaultValues?.is_popular ?? false} />
        <Checkbox
          id="hasFreeTrial"
          name="hasFreeTrial"
          label="Essai gratuit"
          defaultChecked={defaultValues?.has_free_trial ?? false}
        />
        <Checkbox id="isPublished" name="isPublished" label="Publiée (visible sur la landing page)" defaultChecked={defaultValues?.is_published ?? true} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="trialDays">Durée de l&apos;essai (jours)</Label>
        <Input id="trialDays" name="trialDays" type="number" min="0" defaultValue={defaultValues?.trial_days ?? undefined} />
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="sticky bottom-0 self-start bg-background">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
