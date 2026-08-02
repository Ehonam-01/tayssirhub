"use client";

import { useActionState, useEffect, useState } from "react";
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
import { PAYMENT_METHODS } from "@/lib/validations/payment";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-labels";
import { createPayment } from "@/lib/actions/payments";

export function PaymentForm({
  pilgrimId,
  pilgrims,
  onSuccess,
}: {
  pilgrimId?: string;
  pilgrims?: { id: string; first_name: string; last_name: string }[];
  onSuccess?: () => void;
}) {
  const [state, formAction, pending] = useActionState(createPayment, null);
  const [status, setStatus] = useState<"scheduled" | "paid">("scheduled");
  const pilgrimItems = Object.fromEntries((pilgrims ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`]));

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {pilgrimId ? (
        <input type="hidden" name="pilgrimId" value={pilgrimId} />
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pilgrimId">Pèlerin</Label>
          <Select name="pilgrimId" items={pilgrimItems} required>
            <SelectTrigger id="pilgrimId" className="w-full">
              <SelectValue placeholder="Choisir un pèlerin" />
            </SelectTrigger>
            <SelectContent>
              {pilgrims?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.first_name} {p.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={state?.fieldErrors?.pilgrimId} />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount">Montant</Label>
          <Input id="amount" name="amount" type="number" min="0" step="0.01" required />
          <FieldError errors={state?.fieldErrors?.amount} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Type</Label>
          <Select
            name="status"
            value={status}
            onValueChange={(value) => setStatus(value === "paid" ? "paid" : "scheduled")}
            items={{ scheduled: "Échéance planifiée", paid: "Paiement reçu (encaissé)" }}
          >
            <SelectTrigger id="status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scheduled">Échéance planifiée</SelectItem>
              <SelectItem value="paid">Paiement reçu (encaissé)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {status === "scheduled" ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="dueDate">Échéance prévue</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="method">Mode de paiement</Label>
            <Select name="method" items={PAYMENT_METHOD_LABELS}>
              <SelectTrigger id="method" className="w-full">
                <SelectValue placeholder="Choisir..." />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError errors={state?.fieldErrors?.method} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="paidAt">Date de réception</Label>
            <Input id="paidAt" name="paidAt" type="date" />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reference">Référence (optionnel)</Label>
        <Input id="reference" name="reference" placeholder="N° transaction, chèque..." />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </form>
  );
}
