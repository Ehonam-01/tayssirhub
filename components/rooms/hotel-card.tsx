"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Building2, Sparkles, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { HotelForm } from "@/components/rooms/hotel-form";
import { AddRoomDialog } from "@/components/rooms/add-room-dialog";
import { RoomOccupants } from "@/components/rooms/room-occupants";
import { ROOM_TYPE_LABELS } from "@/lib/room-labels";
import { autoAssignRoomsForHotel, deleteHotel, updateHotel, deleteRoom } from "@/lib/actions/rooms";
import type { Database } from "@/lib/types/database";

type Hotel = Database["public"]["Tables"]["hotels"]["Row"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];
type Occupant = { assignmentId: string; firstName: string; lastName: string };
type Candidate = { id: string; firstName: string; lastName: string };

export function HotelCard({
  hotel,
  rooms,
  occupantsByRoom,
  candidates,
}: {
  hotel: Hotel;
  rooms: Room[];
  occupantsByRoom: Record<string, Occupant[]>;
  candidates: Candidate[];
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleAutoAssign() {
    startTransition(async () => {
      const result = await autoAssignRoomsForHotel(hotel.id);
      if (result.error) toast.error(result.error);
      else if (result.message) toast.success(result.message);
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Building2 className="size-4" />
          </span>
          <div>
            <CardTitle>{hotel.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {[hotel.city, hotel.stars ? `${hotel.stars}★` : null].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon-sm" disabled={isPending} onClick={handleAutoAssign} aria-label="Répartir automatiquement">
            <Sparkles />
          </Button>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Modifier l'hôtel">
                  <Pencil />
                </Button>
              }
            />
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Modifier l&apos;hôtel</DialogTitle>
              </DialogHeader>
              <HotelForm
                action={updateHotel.bind(null, hotel.id)}
                defaultValues={hotel}
                submitLabel="Enregistrer"
                onSuccess={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Supprimer l'hôtel">
                  <Trash2 />
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer « {hotel.name} » ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Toutes ses chambres et les affectations de pèlerins associées seront supprimées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <form action={deleteHotel.bind(null, hotel.id)} className="w-full">
                  <AlertDialogAction type="submit" variant="destructive" className="w-full">
                    Supprimer
                  </AlertDialogAction>
                </form>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rooms.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">Aucune chambre pour l&apos;instant.</p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => {
            const occupants = occupantsByRoom[room.id] ?? [];
            const full = occupants.length >= room.capacity;
            return (
              <div key={room.id} className="rounded-lg border border-border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-medium">Chambre {room.number}</span>
                    {room.floor && <span className="text-xs text-muted-foreground"> · Étage {room.floor}</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={full ? "secondary" : "outline"}>
                      {occupants.length}/{room.capacity}
                    </Badge>
                    <form action={deleteRoom.bind(null, room.id)}>
                      <Button type="submit" variant="ghost" size="icon-xs" aria-label="Supprimer la chambre">
                        <Trash2 />
                      </Button>
                    </form>
                  </div>
                </div>
                <p className="mb-2 text-xs text-muted-foreground">{ROOM_TYPE_LABELS[room.type]}</p>
                <RoomOccupants roomId={room.id} occupants={occupants} candidates={candidates} full={full} />
              </div>
            );
          })}
        </div>
        <div>
          <AddRoomDialog hotelId={hotel.id} />
        </div>
      </CardContent>
    </Card>
  );
}
