import Link from "next/link";
import { BellOff, Wallet, FileClock, FileCheck2, CalendarClock, type LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getNotifications, type NotificationCategory } from "@/lib/notifications";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  payment_overdue: Wallet,
  document_expiring: FileClock,
  document_pending: FileCheck2,
  departure_incomplete: CalendarClock,
};

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  payment_overdue: "Paiement en retard",
  document_expiring: "Document à expiration",
  document_pending: "Document à valider",
  departure_incomplete: "Départ imminent",
};

export default async function NotificationsPage() {
  const supabase = await createClient();
  const notifications = await getNotifications(supabase);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Ce qui demande une action, recalculé à chaque visite — rien n&apos;est stocké.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          {notifications.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
              <BellOff className="size-6" />
              <p className="text-sm">Aucune alerte, tout est à jour.</p>
            </div>
          )}
          {notifications.map((notification) => {
            const Icon = CATEGORY_ICONS[notification.category];
            return (
              <Link
                key={notification.id}
                href={notification.href}
                className="flex items-start gap-3 rounded-lg px-2 py-3 hover:bg-muted"
              >
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-4" />
                </span>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={notification.severity === "high" ? "destructive" : "secondary"}>
                      {CATEGORY_LABELS[notification.category]}
                    </Badge>
                  </div>
                  <p className="text-sm">{notification.message}</p>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
