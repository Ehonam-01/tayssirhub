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
import { PricingPlanForm } from "@/components/admin/pricing-plan-form";
import { updatePricingPlan, deletePricingPlan } from "@/lib/actions/pricing-plans";
import type { Database } from "@/lib/types/database";

type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];

export function PricingPlanRowActions({ plan }: { plan: PricingPlan }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Modifier l'offre">
              <Pencil />
            </Button>
          }
        />
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;offre</DialogTitle>
          </DialogHeader>
          <PricingPlanForm
            action={updatePricingPlan.bind(null, plan.id)}
            defaultValues={plan}
            submitLabel="Enregistrer"
            onSuccess={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Supprimer l'offre">
              <Trash2 />
            </Button>
          }
        />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette offre ?</AlertDialogTitle>
            <AlertDialogDescription>
              Elle disparaîtra immédiatement de la landing page. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <form action={deletePricingPlan.bind(null, plan.id)} className="w-full">
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
