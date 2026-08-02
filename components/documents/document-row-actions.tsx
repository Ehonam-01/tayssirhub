"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DocumentDownloadButton } from "@/components/documents/document-download-button";
import { ValidateDocumentButton } from "@/components/documents/validate-document-button";
import { RejectDocumentDialog } from "@/components/documents/reject-document-dialog";
import { deleteDocument } from "@/lib/actions/documents";
import type { Database } from "@/lib/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export function DocumentRowActions({ document }: { document: Document }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <DocumentDownloadButton filePath={document.file_path} />
      {document.status === "en_attente" && (
        <>
          <ValidateDocumentButton documentId={document.id} />
          <RejectDocumentDialog documentId={document.id} />
        </>
      )}
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Supprimer le document">
              <Trash2 />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce document ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le fichier et sa fiche seront définitivement supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <form action={deleteDocument.bind(null, document.id)} className="w-full">
              <AlertDialogAction type="submit" variant="destructive" className="w-full">
                Supprimer
              </AlertDialogAction>
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
