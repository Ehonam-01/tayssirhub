"use client";

import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];

export function HotelForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Hotel>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom de l&apos;hôtel</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
        <FieldError errors={state?.fieldErrors?.name} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" name="city" placeholder="La Mecque, Médine..." defaultValue={defaultValues?.city ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stars">Étoiles (optionnel)</Label>
          <Input id="stars" name="stars" type="number" min="1" max="5" defaultValue={defaultValues?.stars ?? undefined} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} defaultValue={defaultValues?.notes ?? ""} />
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Enregistrement..." : submitLabel}
      </Button>
    </form>
  );
}
