import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "@/lib/types/database";

const LABELS: Record<CampaignStatus, string> = {
  draft: "Brouillon",
  open: "Ouverte",
  full: "Complète",
  closed: "Fermée",
  completed: "Terminée",
};

const VARIANTS: Record<CampaignStatus, "default" | "secondary" | "outline"> = {
  draft: "secondary",
  open: "default",
  full: "outline",
  closed: "secondary",
  completed: "outline",
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}

export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
  hajj: "Hajj",
  omra: "Oumra",
  ramadan: "Ramadan",
  autre: "Autre",
};
