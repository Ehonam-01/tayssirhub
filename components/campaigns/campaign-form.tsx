"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";
import { CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";
import { CAMPAIGN_STATUSES, CURRENCIES } from "@/lib/validations/campaign";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  full: "Complète",
  closed: "Fermée",
  completed: "Terminée",
};

export function CampaignForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Campaign>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom de la campagne</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex. Hajj 2028"
          defaultValue={defaultValues?.name}
          required
        />
        <FieldError errors={state?.fieldErrors?.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select name="type" defaultValue={defaultValues?.type ?? "hajj"} items={CAMPAIGN_TYPE_LABELS} required>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CAMPAIGN_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state?.fieldErrors?.type} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Statut</Label>
          <Select name="status" defaultValue={defaultValues?.status ?? "draft"} items={STATUS_LABELS} required>
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CAMPAIGN_STATUSES.map((value) => (
                <SelectItem key={value} value={value}>
                  {STATUS_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state?.fieldErrors?.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startDate">Date de départ</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            defaultValue={defaultValues?.start_date ?? ""}
          />
          <FieldError errors={state?.fieldErrors?.startDate} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endDate">Date de retour</Label>
          <Input
            id="endDate"
            name="endDate"
            type="date"
            defaultValue={defaultValues?.end_date ?? ""}
          />
          <FieldError errors={state?.fieldErrors?.endDate} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="price">Prix du package</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={defaultValues?.price ?? undefined}
          />
          <FieldError errors={state?.fieldErrors?.price} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="currency">Devise</Label>
          <Select name="currency" defaultValue={defaultValues?.currency ?? "XOF"} required>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state?.fieldErrors?.currency} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quota">Quota (places)</Label>
          <Input
            id="quota"
            name="quota"
            type="number"
            min="1"
            step="1"
            defaultValue={defaultValues?.quota ?? undefined}
          />
          <FieldError errors={state?.fieldErrors?.quota} />
        </div>
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
