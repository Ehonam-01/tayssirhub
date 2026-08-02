"use client";

import Link from "next/link";
import { Download, Trash2, Ban } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MarkAsPaidDialog } from "@/components/payments/mark-as-paid-dialog";
import { cancelPayment, deleteScheduledPayment } from "@/lib/actions/payments";
import type { Database } from "@/lib/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

export function PaymentRowActions({ payment }: { payment: Payment }) {
  if (payment.status === "scheduled") {
    return (
      <div className="flex items-center justify-end gap-2">
        <MarkAsPaidDialog paymentId={payment.id} amount={payment.amount} currency={payment.currency} />
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Supprimer l'échéance">
                <Trash2 />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette échéance ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette échéance planifiée sera définitivement supprimée.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <form action={deleteScheduledPayment.bind(null, payment.id)} className="w-full">
                <AlertDialogAction type="submit" variant="destructive" className="w-full">
                  Supprimer
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  if (payment.status === "paid") {
    return (
      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/api/payments/${payment.id}/receipt`}
          target="_blank"
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <Download /> Reçu
        </Link>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="Annuler le paiement">
                <Ban />
              </Button>
            }
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Annuler ce paiement ?</AlertDialogTitle>
              <AlertDialogDescription>
                Le paiement reste dans l&apos;historique avec le statut « Annulé » — aucune
                suppression, pour garder la traçabilité comptable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Retour</AlertDialogCancel>
              <form action={cancelPayment.bind(null, payment.id)} className="w-full">
                <AlertDialogAction type="submit" variant="destructive" className="w-full">
                  Annuler le paiement
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return null;
}
