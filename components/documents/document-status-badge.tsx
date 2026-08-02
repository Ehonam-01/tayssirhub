import { Badge } from "@/components/ui/badge";
import { DOCUMENT_STATUS_LABELS } from "@/lib/document-labels";
import { formatDate } from "@/lib/format";
import type { DocumentStatus } from "@/lib/types/database";

const VARIANTS: Record<DocumentStatus, "default" | "secondary" | "outline" | "destructive"> = {
  en_attente: "secondary",
  valide: "default",
  expire: "destructive",
  rejete: "destructive",
};

export function DocumentStatusBadge({
  status,
  expiryDate,
}: {
  status: DocumentStatus;
  expiryDate?: string | null;
}) {
  // Un document validé dont la date d'expiration est passée s'affiche comme
  // expiré même si `status` n'a pas été mis à jour manuellement — dérivé à
  // l'affichage plutôt qu'un statut à resynchroniser (même logique que les
  // échéances de paiement en retard).
  const isExpired =
    status !== "rejete" &&
    !!expiryDate &&
    expiryDate < new Date().toISOString().slice(0, 10);

  if (isExpired) {
    return <Badge variant="destructive">Expiré le {formatDate(expiryDate)}</Badge>;
  }

  return <Badge variant={VARIANTS[status]}>{DOCUMENT_STATUS_LABELS[status]}</Badge>;
}
