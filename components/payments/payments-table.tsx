"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { PaymentRowActions } from "@/components/payments/payment-row-actions";
import { PAYMENT_METHOD_LABELS } from "@/lib/payment-labels";
import { formatDate, formatMoney } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"] & {
  pilgrims: { first_name: string; last_name: string } | null;
};

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "Tous les statuts",
  scheduled: "Planifié",
  paid: "Payé",
  cancelled: "Annulé",
};

export function PaymentsTable({ payments }: { payments: Payment[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payments.filter((payment) => {
      const name = `${payment.pilgrims?.first_name ?? ""} ${payment.pilgrims?.last_name ?? ""}`.toLowerCase();
      const matchesSearch = name.includes(query);
      const matchesStatus = status === "all" || payment.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pèlerin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value ?? "all")}
          items={STATUS_FILTER_LABELS}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="scheduled">Planifié</SelectItem>
            <SelectItem value="paid">Payé</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pèlerin</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Méthode</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun paiement ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  <Link href={`/pilgrims/${payment.pilgrim_id}`} className="hover:underline">
                    {payment.pilgrims?.first_name} {payment.pilgrims?.last_name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatMoney(payment.amount, payment.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.method ? PAYMENT_METHOD_LABELS[payment.method] : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.status === "scheduled"
                    ? formatDate(payment.due_date)
                    : formatDate(payment.paid_at)}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={payment.status} dueDate={payment.due_date} />
                </TableCell>
                <TableCell>
                  <PaymentRowActions payment={payment} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
