// Alertes dérivées à la lecture depuis les tables existantes (paiements,
// documents, campagnes) — jamais stockées, même principe que le reliquat des
// paiements ou le badge "Expiré" des documents, généralisé ici en liste
// agence entière plutôt qu'un seul enregistrement.
import { getDateWindow } from "@/lib/dates";
import { formatDate, formatMoney } from "@/lib/format";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-labels";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type NotificationCategory =
  | "payment_overdue"
  | "document_expiring"
  | "document_pending"
  | "departure_incomplete";

export type NotificationSeverity = "high" | "medium";

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  message: string;
  href: string;
  date: string | null;
}

const SEVERITY_RANK: Record<NotificationSeverity, number> = { high: 0, medium: 1 };

export async function getNotifications(supabase: SupabaseServerClient): Promise<AppNotification[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { until: in7Days } = getDateWindow(7);

  const [{ data: overduePayments }, { data: expiringDocuments }, { data: pendingDocuments }, { data: soonCampaigns }] =
    await Promise.all([
      supabase
        .from("payments")
        .select("id, amount, currency, due_date, pilgrim_id, pilgrims(first_name, last_name)")
        .eq("status", "scheduled")
        .lt("due_date", today),
      supabase
        .from("documents")
        .select("id, type, expiry_date, pilgrim_id, pilgrims(first_name, last_name)")
        .neq("status", "rejete")
        .not("expiry_date", "is", null)
        .lte("expiry_date", in7Days),
      supabase
        .from("documents")
        .select("id, type, pilgrim_id, pilgrims(first_name, last_name)")
        .eq("status", "en_attente"),
      supabase.from("campaigns").select("id, name, start_date").gte("start_date", today).lte("start_date", in7Days),
    ]);

  const notifications: AppNotification[] = [];

  for (const payment of overduePayments ?? []) {
    const name = payment.pilgrims ? `${payment.pilgrims.first_name} ${payment.pilgrims.last_name}` : "un pèlerin";
    notifications.push({
      id: `payment-${payment.id}`,
      category: "payment_overdue",
      severity: "high",
      message: `Paiement de ${formatMoney(payment.amount, payment.currency)} en retard pour ${name} (échéance ${formatDate(payment.due_date)})`,
      href: `/pilgrims/${payment.pilgrim_id}`,
      date: payment.due_date,
    });
  }

  for (const doc of expiringDocuments ?? []) {
    const name = doc.pilgrims ? `${doc.pilgrims.first_name} ${doc.pilgrims.last_name}` : "un pèlerin";
    const label = DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type;
    const isExpired = !!doc.expiry_date && doc.expiry_date < today;
    notifications.push({
      id: `document-expiry-${doc.id}`,
      category: "document_expiring",
      severity: isExpired ? "high" : "medium",
      message: isExpired
        ? `${label} expiré pour ${name} (le ${formatDate(doc.expiry_date)})`
        : `${label} expire bientôt pour ${name} (le ${formatDate(doc.expiry_date)})`,
      href: `/pilgrims/${doc.pilgrim_id}`,
      date: doc.expiry_date,
    });
  }

  for (const doc of pendingDocuments ?? []) {
    const name = doc.pilgrims ? `${doc.pilgrims.first_name} ${doc.pilgrims.last_name}` : "un pèlerin";
    const label = DOCUMENT_TYPE_LABELS[doc.type] ?? doc.type;
    notifications.push({
      id: `document-pending-${doc.id}`,
      category: "document_pending",
      severity: "medium",
      message: `${label} en attente de validation pour ${name}`,
      href: `/pilgrims/${doc.pilgrim_id}`,
      date: null,
    });
  }

  const campaignIds = (soonCampaigns ?? []).map((c) => c.id);
  if (campaignIds.length > 0) {
    const { data: incompletePilgrims } = await supabase
      .from("pilgrims")
      .select("campaign_id")
      .in("campaign_id", campaignIds)
      .in("status", ["prospect", "dossier_incomplet"]);

    const incompleteCounts = new Map<string, number>();
    for (const pilgrim of incompletePilgrims ?? []) {
      if (!pilgrim.campaign_id) continue;
      incompleteCounts.set(pilgrim.campaign_id, (incompleteCounts.get(pilgrim.campaign_id) ?? 0) + 1);
    }

    for (const campaign of soonCampaigns ?? []) {
      const count = incompleteCounts.get(campaign.id) ?? 0;
      if (count === 0) continue;
      notifications.push({
        id: `departure-${campaign.id}`,
        category: "departure_incomplete",
        severity: "high",
        message: `Départ de "${campaign.name}" le ${formatDate(campaign.start_date)} — ${count} pèlerin(s) au dossier incomplet`,
        href: `/campaigns/${campaign.id}`,
        date: campaign.start_date,
      });
    }
  }

  notifications.sort(
    (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || (a.date ?? "").localeCompare(b.date ?? ""),
  );

  return notifications;
}
