"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/accounting/expense-form";
import { createExpense } from "@/lib/actions/expenses";

export function AddExpenseDialog({
  campaignId,
  campaigns,
  triggerLabel = "Ajouter une dépense",
}: {
  campaignId?: string;
  campaigns?: { id: string; name: string }[];
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> {triggerLabel}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une dépense</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          action={createExpense}
          campaignId={campaignId}
          campaigns={campaigns}
          submitLabel="Ajouter la dépense"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
