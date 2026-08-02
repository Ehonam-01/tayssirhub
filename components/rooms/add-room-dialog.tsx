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
import { RoomForm } from "@/components/rooms/room-form";
import { createRoom } from "@/lib/actions/rooms";

export function AddRoomDialog({ hotelId }: { hotelId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Plus /> Ajouter une chambre
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une chambre</DialogTitle>
        </DialogHeader>
        <RoomForm
          action={createRoom.bind(null, hotelId)}
          submitLabel="Ajouter la chambre"
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
