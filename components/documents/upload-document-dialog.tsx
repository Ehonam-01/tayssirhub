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
import { DocumentForm } from "@/components/documents/document-form";

export function UploadDocumentDialog({
  pilgrimId,
  pilgrims,
  agencyId,
  triggerLabel = "Ajouter un document",
}: {
  pilgrimId?: string;
  pilgrims?: { id: string; first_name: string; last_name: string }[];
  agencyId: string;
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
          <DialogTitle>Ajouter un document</DialogTitle>
          <DialogDescription>
            Passeport, visa, photo, vaccins, billet, contrat ou pièce diverse.
          </DialogDescription>
        </DialogHeader>
        <DocumentForm
          pilgrimId={pilgrimId}
          pilgrims={pilgrims}
          agencyId={agencyId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
