"use client";

import { useState } from "react";
import { Plane, Pencil, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { FlightForm } from "@/components/flights/flight-form";
import { FLIGHT_DIRECTION_LABELS } from "@/lib/flight-labels";
import { formatDate } from "@/lib/format";
import { updateFlight, deleteFlight } from "@/lib/actions/flights";
import type { Database } from "@/lib/types/database";

type Flight = Database["public"]["Tables"]["flights"]["Row"];

const DIRECTION_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  aller: "default",
  retour: "secondary",
  interne: "outline",
};

export function FlightCard({ flight }: { flight: Flight }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Plane className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={DIRECTION_VARIANT[flight.direction]}>
                  {FLIGHT_DIRECTION_LABELS[flight.direction]}
                </Badge>
                {(flight.airline || flight.flight_number) && (
                  <span className="text-sm font-medium">
                    {[flight.airline, flight.flight_number].filter(Boolean).join(" · ")}
                  </span>
                )}
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                {flight.departure_airport ?? "—"}
                <ArrowRight className="size-3.5" />
                {flight.arrival_airport ?? "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Modifier le vol">
                    <Pencil />
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Modifier le vol</DialogTitle>
                </DialogHeader>
                <FlightForm
                  action={updateFlight.bind(null, flight.id)}
                  defaultValues={flight}
                  submitLabel="Enregistrer"
                  onSuccess={() => setEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="ghost" size="icon-sm" aria-label="Supprimer le vol">
                    <Trash2 />
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ce vol ?</AlertDialogTitle>
                  <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <form action={deleteFlight.bind(null, flight.id)} className="w-full">
                    <AlertDialogAction type="submit" variant="destructive" className="w-full">
                      Supprimer
                    </AlertDialogAction>
                  </form>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          <p>Départ : {flight.departure_at ? formatDate(flight.departure_at, "d MMM yyyy 'à' HH:mm") : "—"}</p>
          <p>Arrivée : {flight.arrival_at ? formatDate(flight.arrival_at, "d MMM yyyy 'à' HH:mm") : "—"}</p>
          {flight.layovers && <p>Escales : {flight.layovers}</p>}
          {flight.baggage_allowance && <p>Bagages : {flight.baggage_allowance}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
