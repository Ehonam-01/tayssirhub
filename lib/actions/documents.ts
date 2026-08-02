"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { documentSchema, reviewDocumentSchema } from "@/lib/validations/document";
import type { ActionState } from "@/lib/actions/types";

function revalidateDocumentPaths(pilgrimId?: string | null) {
  if (pilgrimId) revalidatePath(`/pilgrims/${pilgrimId}`);
  revalidatePath("/documents");
  revalidatePath("/dashboard");
}

export async function createDocument(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = documentSchema.safeParse({
    pilgrimId: formData.get("pilgrimId"),
    type: formData.get("type"),
    filePath: formData.get("filePath"),
    fileName: formData.get("fileName"),
    fileSize: formData.get("fileSize") || undefined,
    mimeType: formData.get("mimeType") ?? "",
    expiryDate: formData.get("expiryDate") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  if (!profile?.agency_id) redirect("/onboarding");

  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert({
    agency_id: profile.agency_id,
    pilgrim_id: parsed.data.pilgrimId,
    type: parsed.data.type,
    file_path: parsed.data.filePath,
    file_name: parsed.data.fileName,
    file_size: parsed.data.fileSize ?? null,
    mime_type: parsed.data.mimeType || null,
    expiry_date: parsed.data.expiryDate || null,
    uploaded_by: profile.id,
  });

  if (error) {
    // Le fichier est déjà uploadé côté client à ce stade : si l'insertion des
    // métadonnées échoue, on supprime l'objet Storage orphelin plutôt que de
    // laisser un fichier sans ligne correspondante.
    await supabase.storage.from("documents").remove([parsed.data.filePath]);
    return { error: "Impossible d'enregistrer le document." };
  }

  revalidateDocumentPaths(parsed.data.pilgrimId);
  return { message: "Document ajouté." };
}

export async function reviewDocument(
  documentId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = reviewDocumentSchema.safeParse({
    status: formData.get("status"),
    rejectionReason: formData.get("rejectionReason") ?? "",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const profile = await getCurrentProfile();
  const supabase = await createClient();
  const { data: document, error } = await supabase
    .from("documents")
    .update({
      status: parsed.data.status,
      rejection_reason:
        parsed.data.status === "rejete" ? parsed.data.rejectionReason || null : null,
      reviewed_by: profile?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", documentId)
    .select("pilgrim_id")
    .single();

  if (error || !document) {
    return { error: "Impossible de mettre à jour le document." };
  }

  revalidateDocumentPaths(document.pilgrim_id);
  return { message: parsed.data.status === "valide" ? "Document validé." : "Document rejeté." };
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient();
  const { data: document } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .select("pilgrim_id, file_path")
    .single();

  if (document?.file_path) {
    await supabase.storage.from("documents").remove([document.file_path]);
  }

  revalidateDocumentPaths(document?.pilgrim_id);
}
