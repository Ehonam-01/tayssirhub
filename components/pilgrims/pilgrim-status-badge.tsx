import { Badge } from "@/components/ui/badge";
import type { PilgrimStatus } from "@/lib/types/database";

const LABELS: Record<PilgrimStatus, string> = {
  prospect: "Prospect",
  inscrit: "Inscrit",
  dossier_incomplet: "Dossier incomplet",
  dossier_complet: "Dossier complet",
  confirme: "Confirmé",
  parti: "Parti",
  revenu: "Revenu",
  annule: "Annulé",
};

const VARIANTS: Record<PilgrimStatus, "default" | "secondary" | "outline" | "destructive"> = {
  prospect: "secondary",
  inscrit: "outline",
  dossier_incomplet: "destructive",
  dossier_complet: "outline",
  confirme: "default",
  parti: "default",
  revenu: "outline",
  annule: "destructive",
};

export function PilgrimStatusBadge({ status }: { status: PilgrimStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
