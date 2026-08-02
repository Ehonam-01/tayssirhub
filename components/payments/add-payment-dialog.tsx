"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PaymentForm } from "@/components/payments/payment-form";

export function AddPaymentDialog({
  pilgrimId,
  pilgrims,
  triggerLabel = "Enregistrer un paiement",
}: {
  pilgrimId?: string;
  pilgrims?: { id: string; first_name: string; last_name: string }[];
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> {triggerLabel}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Ajoutez une échéance planifiée ou un paiement déjà reçu.
          </DialogDescription>
        </DialogHeader>
        <PaymentForm pilgrimId={pilgrimId} pilgrims={pilgrims} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
