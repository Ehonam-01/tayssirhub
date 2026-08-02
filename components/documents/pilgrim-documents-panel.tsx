import { Card, CardContent } from "@/components/ui/card";
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-labels";
import { formatDate } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"];

export function PilgrimDocumentsPanel({
  pilgrimId,
  agencyId,
  documents,
}: {
  pilgrimId: string;
  agencyId: string;
  documents: Document[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <UploadDocumentDialog pilgrimId={pilgrimId} agencyId={agencyId} />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          {documents.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun document ajouté pour l&apos;instant.
            </p>
          )}
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">{document.file_name}</span>
                <span className="text-xs text-muted-foreground">
                  {DOCUMENT_TYPE_LABELS[document.type]} · Ajouté le {formatDate(document.created_at)}
                  {document.expiry_date && ` · Expire le ${formatDate(document.expiry_date)}`}
                </span>
                {document.status === "rejete" && document.rejection_reason && (
                  <span className="text-xs text-destructive">
                    Motif : {document.rejection_reason}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <DocumentStatusBadge status={document.status} expiryDate={document.expiry_date} />
                <DocumentRowActions document={document} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
