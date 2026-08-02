"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { ExpenseForm } from "@/components/accounting/expense-form";
import { updateExpense, deleteExpense } from "@/lib/actions/expenses";
import type { Database } from "@/lib/types/database";

type Expense = Database["public"]["Tables"]["expenses"]["Row"];

export function ExpenseRowActions({
  expense,
  campaignId,
  campaigns,
}: {
  expense: Expense;
  campaignId?: string;
  campaigns?: { id: string; name: string }[];
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Modifier la dépense">
              <Pencil />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier la dépense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            action={updateExpense.bind(null, expense.id)}
            defaultValues={expense}
            campaignId={campaignId}
            campaigns={campaigns}
            submitLabel="Enregistrer"
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Supprimer la dépense">
              <Trash2 />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette dépense ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <form action={deleteExpense.bind(null, expense.id)} className="w-full">
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
