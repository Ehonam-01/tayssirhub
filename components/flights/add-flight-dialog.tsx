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
import { FlightForm } from "@/components/flights/flight-form";
import { createFlight } from "@/lib/actions/flights";

export function AddFlightDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> Ajouter un vol
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajouter un vol</DialogTitle>
        </DialogHeader>
        <FlightForm
          action={createFlight.bind(null, campaignId)}
          submitLabel="Ajouter le vol"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
