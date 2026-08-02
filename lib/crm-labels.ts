export const CRM_STAGES = [
  "prospect",
  "contacte",
  "relance",
  "inscrit",
  "paiement_recu",
  "voyage_termine",
] as const;

export const CRM_STAGE_LABELS: Record<string, string> = {
  prospect: "Prospect",
  contacte: "Contacté",
  relance: "Relancé",
  inscrit: "Inscrit",
  paiement_recu: "Paiement reçu",
  voyage_termine: "Voyage terminé",
};
