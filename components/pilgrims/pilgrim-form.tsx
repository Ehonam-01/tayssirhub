"use client";

import { useActionState } from "react";
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
import { PILGRIM_GENDERS, PILGRIM_STATUSES } from "@/lib/validations/pilgrim";
import { CRM_STAGES, CRM_STAGE_LABELS } from "@/lib/crm-labels";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Pilgrim = Database["public"]["Tables"]["pilgrims"]["Row"];

const GENDER_LABELS: Record<string, string> = { homme: "Homme", femme: "Femme" };

const STATUS_LABELS: Record<string, string> = {
  prospect: "Prospect",
  inscrit: "Inscrit",
  dossier_incomplet: "Dossier incomplet",
  dossier_complet: "Dossier complet",
  confirme: "Confirmé",
  parti: "Parti",
  revenu: "Revenu",
  annule: "Annulé",
};

export function PilgrimForm({
  action,
  defaultValues,
  defaultCampaignId,
  campaigns,
  guides,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Pilgrim>;
  defaultCampaignId?: string;
  campaigns: { id: string; name: string }[];
  guides: { id: string; full_name: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const campaignItems = Object.fromEntries(campaigns.map((c) => [c.id, c.name]));
  const guideItems = Object.fromEntries(guides.map((g) => [g.id, g.full_name]));

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium">Identité</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" name="firstName" defaultValue={defaultValues?.first_name} required />
            <FieldError errors={state?.fieldErrors?.firstName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" name="lastName" defaultValue={defaultValues?.last_name} required />
            <FieldError errors={state?.fieldErrors?.lastName} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="gender">Genre</Label>
            <Select name="gender" defaultValue={defaultValues?.gender ?? undefined} items={GENDER_LABELS}>
              <SelectTrigger id="gender" className="w-full">
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {PILGRIM_GENDERS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {GENDER_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              defaultValue={defaultValues?.birth_date ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nationality">Nationalité</Label>
            <Input id="nationality" name="nationality" defaultValue={defaultValues?.nationality ?? ""} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="profession">Profession</Label>
          <Input id="profession" name="profession" defaultValue={defaultValues?.profession ?? ""} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium">Contact</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
            <FieldError errors={state?.fieldErrors?.email} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="emergencyContactName">Personne à prévenir</Label>
            <Input
              id="emergencyContactName"
              name="emergencyContactName"
              defaultValue={defaultValues?.emergency_contact_name ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="emergencyContactPhone">Téléphone à prévenir</Label>
            <Input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              defaultValue={defaultValues?.emergency_contact_phone ?? ""}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-1 text-sm font-medium">Voyage</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="campaignId">Campagne</Label>
            <Select
              name="campaignId"
              defaultValue={defaultValues?.campaign_id ?? defaultCampaignId ?? undefined}
              items={campaignItems}
            >
              <SelectTrigger id="campaignId" className="w-full">
                <SelectValue placeholder="Aucune (prospect)" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guideId">Guide</Label>
            <Select name="guideId" defaultValue={defaultValues?.guide_id ?? undefined} items={guideItems}>
              <SelectTrigger id="guideId" className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                {guides.map((guide) => (
                  <SelectItem key={guide.id} value={guide.id}>
                    {guide.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="crmStage">Étape commerciale</Label>
            <Select
              name="crmStage"
              defaultValue={defaultValues?.crm_stage ?? "prospect"}
              items={CRM_STAGE_LABELS}
              required
            >
              <SelectTrigger id="crmStage" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CRM_STAGES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {CRM_STAGE_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="status">Statut du dossier</Label>
            <Select
              name="status"
              defaultValue={defaultValues?.status ?? "prospect"}
              items={STATUS_LABELS}
              required
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PILGRIM_STATUSES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {STATUS_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={state?.fieldErrors?.status} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="packagePrice">Prix du package (optionnel)</Label>
            <Input
              id="packagePrice"
              name="packagePrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="Prix de la campagne par défaut"
              defaultValue={defaultValues?.package_price ?? undefined}
            />
            <FieldError errors={state?.fieldErrors?.packagePrice} />
          </div>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1 text-sm font-medium">Notes</legend>
        <Label htmlFor="notes" className="sr-only">
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          rows={4}
          placeholder="Informations complémentaires..."
          defaultValue={defaultValues?.notes ?? ""}
        />
      </fieldset>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
