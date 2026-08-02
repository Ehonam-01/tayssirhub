import Link from "next/link";
import { Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { PaymentRowActions } from "@/components/payments/payment-row-actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-labels";
import { formatDate, formatMoney } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

export function PilgrimPaymentsPanel({
  pilgrimId,
  payments,
  totalDue,
  currency,
}: {
  pilgrimId: string;
  payments: Payment[];
  totalDue: number | null;
  currency: string;
}) {
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const balance = totalDue !== null ? totalDue - totalPaid : null;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <Link
          href={`/api/pilgrims/${pilgrimId}/statement`}
          target="_blank"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Download /> Relevé de compte
        </Link>
        <AddPaymentDialog pilgrimId={pilgrimId} triggerLabel="Ajouter" />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-1">
          {payments.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun paiement enregistré pour l&apos;instant.
            </p>
          )}
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {formatMoney(payment.amount, payment.currency)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {payment.method ? `${PAYMENT_METHOD_LABELS[payment.method]} · ` : ""}
                  {payment.status === "scheduled"
                    ? `Échéance ${formatDate(payment.due_date)}`
                    : formatDate(payment.paid_at)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <PaymentStatusBadge status={payment.status} dueDate={payment.due_date} />
                <PaymentRowActions payment={payment} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
