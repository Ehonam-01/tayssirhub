"use client";

import { useActionState, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { reviewDocument } from "@/lib/actions/documents";

export function RejectDocumentDialog({ documentId }: { documentId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(reviewDocument.bind(null, documentId), null);

  const [lastHandledState, setLastHandledState] = useState(state);
  if (state !== lastHandledState) {
    setLastHandledState(state);
    if (state?.message) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Rejeter le document">
            <X />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Rejeter ce document</DialogTitle>
          <DialogDescription>
            Indiquez le motif pour que l&apos;équipe sache quoi corriger.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="status" value="rejete" />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rejectionReason">Motif du rejet</Label>
            <Textarea id="rejectionReason" name="rejectionReason" rows={3} required />
            <FieldError errors={state?.fieldErrors?.rejectionReason} />
          </div>
          <FormMessage state={state} />
          <Button type="submit" variant="destructive" disabled={pending} className="w-full">
            {pending ? "Envoi..." : "Rejeter le document"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
