import { Badge } from "@/components/ui/badge";
import { PAYMENT_STATUS_LABELS } from "@/lib/payment-labels";
import type { PaymentStatus } from "@/lib/types/database";

const VARIANTS: Record<PaymentStatus, "default" | "secondary" | "outline"> = {
  scheduled: "secondary",
  paid: "default",
  cancelled: "outline",
};

export function PaymentStatusBadge({
  status,
  dueDate,
}: {
  status: PaymentStatus;
  dueDate?: string | null;
}) {
  const isOverdue =
    status === "scheduled" && !!dueDate && dueDate < new Date().toISOString().slice(0, 10);

  if (isOverdue) {
    return <Badge variant="destructive">En retard</Badge>;
  }

  return <Badge variant={VARIANTS[status]}>{PAYMENT_STATUS_LABELS[status]}</Badge>;
}
