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
import { FLIGHT_DIRECTIONS } from "@/lib/validations/flight";
import { FLIGHT_DIRECTION_LABELS } from "@/lib/flight-labels";
import type { ActionState } from "@/lib/actions/types";
import type { Database } from "@/lib/types/database";

type Flight = Database["public"]["Tables"]["flights"]["Row"];

function toDateTimeLocal(value: string | null | undefined) {
  if (!value) return "";
  // "2028-06-12T08:00:00+00:00" -> "2028-06-12T08:00" pour l'input datetime-local
  return value.slice(0, 16);
}

export function FlightForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: Partial<Flight>;
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
          <Label htmlFor="direction">Direction</Label>
          <Select
            name="direction"
            defaultValue={defaultValues?.direction ?? "aller"}
            items={FLIGHT_DIRECTION_LABELS}
            required
          >
            <SelectTrigger id="direction" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLIGHT_DIRECTIONS.map((direction) => (
                <SelectItem key={direction} value={direction}>
                  {FLIGHT_DIRECTION_LABELS[direction]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="airline">Compagnie</Label>
          <Input id="airline" name="airline" defaultValue={defaultValues?.airline ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="flightNumber">N° de vol</Label>
        <Input id="flightNumber" name="flightNumber" placeholder="Ex. SN123" defaultValue={defaultValues?.flight_number ?? ""} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="departureAirport">Aéroport de départ</Label>
          <Input
            id="departureAirport"
            name="departureAirport"
            placeholder="Ex. Dakar (DSS)"
            defaultValue={defaultValues?.departure_airport ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="arrivalAirport">Aéroport d&apos;arrivée</Label>
          <Input
            id="arrivalAirport"
            name="arrivalAirport"
            placeholder="Ex. Djeddah (JED)"
            defaultValue={defaultValues?.arrival_airport ?? ""}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="departureAt">Départ</Label>
          <Input
            id="departureAt"
            name="departureAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(defaultValues?.departure_at)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="arrivalAt">Arrivée</Label>
          <Input
            id="arrivalAt"
            name="arrivalAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(defaultValues?.arrival_at)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="layovers">Escales (optionnel)</Label>
          <Input
            id="layovers"
            name="layovers"
            placeholder="Ex. 1 escale à Istanbul, 2h"
            defaultValue={defaultValues?.layovers ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="baggageAllowance">Bagages</Label>
          <Input
            id="baggageAllowance"
            name="baggageAllowance"
            placeholder="Ex. 23kg soute + 7kg cabine"
            defaultValue={defaultValues?.baggage_allowance ?? ""}
          />
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
