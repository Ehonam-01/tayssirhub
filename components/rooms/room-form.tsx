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
import { ROOM_TYPES } from "@/lib/validations/room";
import { ROOM_TYPE_LABELS } from "@/lib/room-labels";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

export function RoomForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Room>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(action, null);

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="number">Numéro</Label>
          <Input id="number" name="number" defaultValue={defaultValues?.number} required />
          <FieldError errors={state?.fieldErrors?.number} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="floor">Étage (optionnel)</Label>
          <Input id="floor" name="floor" defaultValue={defaultValues?.floor ?? ""} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="type">Type</Label>
          <Select
            name="type"
            defaultValue={defaultValues?.type ?? "quadruple"}
            items={ROOM_TYPE_LABELS}
            required
          >
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOM_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {ROOM_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="capacity">Capacité</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            step="1"
            defaultValue={defaultValues?.capacity ?? 4}
            required
          />
          <FieldError errors={state?.fieldErrors?.capacity} />
        </div>
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
