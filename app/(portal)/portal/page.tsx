import { redirect } from "next/navigation";
import { BedDouble, Plane, UserRound, LogOut } from "lucide-react";
import { getCurrentPilgrim } from "@/lib/supabase/get-current-pilgrim";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-labels";
import { DOCUMENT_TYPE_LABELS } from "@/lib/document-labels";
import { formatDate, formatMoney } from "@/lib/format";
import { portalLogout } from "@/lib/actions/portal-auth";

export const dynamic = "force-dynamic";

export default async function PortalDashboardPage() {
  const pilgrim = await getCurrentPilgrim();
  if (!pilgrim) redirect("/portal/login");

  const supabase = await createClient();

  const [{ data: payments }, { data: documents }, { data: roomAssignments }, { data: flights }] =
    await Promise.all([
      supabase
        .from("payments")
        .select("*")
        .eq("pilgrim_id", pilgrim.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("documents")
        .select("*")
        .eq("pilgrim_id", pilgrim.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("room_assignments")
        .select("id, rooms(number), hotels(name, city)")
        .eq("pilgrim_id", pilgrim.id),
      pilgrim.campaign_id
        ? supabase
            .from("flights")
            .select("*")
            .eq("campaign_id", pilgrim.campaign_id)
            .order("departure_at", { ascending: true })
        : Promise.resolve({ data: [] as never[] }),
    ]);

  const currency = pilgrim.campaigns?.currency ?? "XOF";
  const totalDue = pilgrim.package_price ?? pilgrim.campaigns?.price ?? null;
  const totalPaid = (payments ?? [])
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const balance = totalDue !== null ? totalDue - totalPaid : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">
            {pilgrim.first_name} {pilgrim.last_name}
          </h1>
          <p className="text-sm text-muted-foreground">{pilgrim.campaigns?.name ?? "Aucune campagne rattachée"}</p>
        </div>
        <div className="flex items-center gap-3">
          <PilgrimStatusBadge status={pilgrim.status} />
          <form action={portalLogout}>
            <Button variant="ghost" size="icon" aria-label="Se déconnecter" type="submit">
              <LogOut />
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paiements</CardTitle>
          <CardDescription>Vos échéances et paiements reçus par l&apos;agence.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Prix total</p>
              <p className="font-heading text-lg font-semibold">
                {totalDue !== null ? formatMoney(totalDue, currency) : "Non défini"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total payé</p>
              <p className="font-heading text-lg font-semibold">{formatMoney(totalPaid, currency)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reliquat</p>
              <p className="font-heading text-lg font-semibold text-gold">
                {balance !== null ? formatMoney(balance, currency) : "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {!payments?.length && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Aucun paiement enregistré pour l&apos;instant.
              </p>
            )}
            {payments?.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{formatMoney(payment.amount, payment.currency)}</span>
                  <span className="text-xs text-muted-foreground">
                    {payment.method ? `${PAYMENT_METHOD_LABELS[payment.method]} · ` : ""}
                    {payment.status === "scheduled"
                      ? `Échéance ${formatDate(payment.due_date)}`
                      : formatDate(payment.paid_at)}
                  </span>
                </div>
                <PaymentStatusBadge status={payment.status} dueDate={payment.due_date} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
          <CardDescription>Pièces déposées par votre agence pour votre dossier.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {!documents?.length && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Aucun document déposé pour l&apos;instant.
            </p>
          )}
          {documents?.map((document) => (
            <div key={document.id} className="flex items-center justify-between gap-3 rounded-lg px-2 py-2">
              <span className="text-sm font-medium">{DOCUMENT_TYPE_LABELS[document.type] ?? document.type}</span>
              <DocumentStatusBadge status={document.status} expiryDate={document.expiry_date} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BedDouble className="size-4" /> Hébergement
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {!roomAssignments?.length && (
              <p className="text-sm text-muted-foreground">Pas encore attribué.</p>
            )}
            {roomAssignments?.map((assignment) => (
              <p key={assignment.id} className="text-sm">
                Chambre {assignment.rooms?.number} · {assignment.hotels?.name}
                {assignment.hotels?.city ? ` (${assignment.hotels.city})` : ""}
              </p>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRound className="size-4" /> Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {!pilgrim.guides ? (
              <p className="text-sm text-muted-foreground">Pas encore attribué.</p>
            ) : (
              <>
                <p className="text-sm font-medium">{pilgrim.guides.full_name}</p>
                {pilgrim.guides.phone && <p className="text-sm text-muted-foreground">{pilgrim.guides.phone}</p>}
                {pilgrim.guides.email && <p className="text-sm text-muted-foreground">{pilgrim.guides.email}</p>}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="size-4" /> Vols
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {!flights?.length && <p className="text-sm text-muted-foreground">Aucun vol renseigné pour l&apos;instant.</p>}
          {flights?.map((flight) => (
            <div key={flight.id} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <p className="font-medium">
                {flight.departure_airport ?? "—"} → {flight.arrival_airport ?? "—"}
              </p>
              <p className="text-muted-foreground">
                {[flight.airline, flight.flight_number].filter(Boolean).join(" · ")}
                {flight.departure_at ? ` · ${formatDate(flight.departure_at, "d MMM yyyy 'à' HH:mm")}` : ""}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
