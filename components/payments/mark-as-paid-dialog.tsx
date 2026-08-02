"use client";

import { useActionState, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";
import { PAYMENT_METHODS } from "@/lib/validations/payment";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-labels";
import { formatMoney } from "@/lib/format";
import { markAsPaid } from "@/lib/actions/payments";

export function MarkAsPaidDialog({
  paymentId,
  amount,
  currency,
}: {
  paymentId: string;
  amount: number;
  currency: string;
}) {
  const [open, setOpen] = useState(false);
  const action = markAsPaid.bind(null, paymentId);
  const [state, formAction, pending] = useActionState(action, null);

  // Ferme le dialogue dès qu'un nouveau succès arrive. Pattern "ajuster un
  // state pendant le rendu" (recommandé par React plutôt qu'un effet ici) :
  // le blocage observé pendant le debug venait de vraies erreurs serveur
  // (latence réseau de cet environnement), pas de cette logique.
  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state?.message) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="outline">
            Marquer payé
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmer la réception</DialogTitle>
          <DialogDescription>{formatMoney(amount, currency)}</DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="method">Mode de paiement</Label>
            <Select name="method" items={PAYMENT_METHOD_LABELS} required>
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
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input id="reference" name="reference" placeholder="N° transaction, chèque..." />
          </div>
          <FormMessage state={state} />
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Confirmation..." : "Confirmer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
