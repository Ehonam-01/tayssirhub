"use client";

import { useActionState, useEffect } from "react";
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
import { DOCUMENT_TYPES } from "@/lib/validations/document";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-labels";
import { createClient } from "@/lib/supabase/client";
import { createDocument } from "@/lib/actions/documents";
import type { ActionState } from "@/lib/actions/types";

export function DocumentForm({
  pilgrimId,
  pilgrims,
  agencyId,
  onSuccess,
}: {
  pilgrimId?: string;
  pilgrims?: { id: string; first_name: string; last_name: string }[];
  agencyId: string;
  onSuccess?: () => void;
}) {
  async function action(_prevState: ActionState, formData: FormData): Promise<ActionState> {
    const targetPilgrimId = pilgrimId || (formData.get("pilgrimId") as string | null);
    if (!targetPilgrimId) {
      return { fieldErrors: { pilgrimId: ["Choisissez un pèlerin."] } };
    }

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { fieldErrors: { file: ["Sélectionnez un fichier."] } };
    }

    const path = `${agencyId}/${targetPilgrimId}/${crypto.randomUUID()}-${file.name}`;
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
    if (uploadError) {
      return { error: "Échec de l'envoi du fichier. Réessayez." };
    }

    formData.set("pilgrimId", targetPilgrimId);
    formData.set("filePath", path);
    formData.set("fileName", file.name);
    formData.set("fileSize", String(file.size));
    formData.set("mimeType", file.type);

    return createDocument(_prevState, formData);
  }

  const [state, formAction, pending] = useActionState(action, null);
  const pilgrimItems = Object.fromEntries((pilgrims ?? []).map((p) => [p.id, `${p.first_name} ${p.last_name}`]));

  useEffect(() => {
    if (state?.message) onSuccess?.();
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {!pilgrimId && (
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
          <Label htmlFor="type">Type de document</Label>
          <Select name="type" defaultValue="passeport" items={DOCUMENT_TYPE_LABELS} required>
            <SelectTrigger id="type" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {DOCUMENT_TYPE_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="expiryDate">Date d&apos;expiration (optionnel)</Label>
          <Input id="expiryDate" name="expiryDate" type="date" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file">Fichier</Label>
        <Input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required />
        <p className="text-xs text-muted-foreground">PDF ou image, 10 Mo maximum.</p>
        <FieldError errors={state?.fieldErrors?.file} />
      </div>

      <FormMessage state={state} />

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Envoi..." : "Ajouter le document"}
      </Button>
    </form>
  );
}
