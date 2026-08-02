"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reviewDocument } from "@/lib/actions/documents";

export function ValidateDocumentButton({ documentId }: { documentId: string }) {
  const [, formAction, pending] = useActionState(reviewDocument.bind(null, documentId), null);

  return (
    <form action={formAction}>
      <input type="hidden" name="status" value="valide" />
      <Button type="submit" variant="ghost" size="icon-sm" disabled={pending} aria-label="Valider le document">
        <Check />
      </Button>
    </form>
  );
}
