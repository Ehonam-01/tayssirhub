"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HotelForm } from "@/components/rooms/hotel-form";
import { createHotel } from "@/lib/actions/rooms";

export function AddHotelDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <Plus /> Ajouter un hôtel
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un hôtel</DialogTitle>
          <DialogDescription>Une campagne peut avoir plusieurs hôtels (ex. La Mecque, Médine).</DialogDescription>
        </DialogHeader>
        <HotelForm
          action={createHotel.bind(null, campaignId)}
          submitLabel="Ajouter l'hôtel"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
