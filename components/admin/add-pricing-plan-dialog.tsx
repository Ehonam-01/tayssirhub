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
import { PricingPlanForm } from "@/components/admin/pricing-plan-form";
import { createPricingPlan } from "@/lib/actions/pricing-plans";

export function AddPricingPlanDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> Ajouter une offre
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter une offre</DialogTitle>
        </DialogHeader>
        <PricingPlanForm action={createPricingPlan} submitLabel="Créer l'offre" onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
