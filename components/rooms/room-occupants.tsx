"use client";

import { useTransition } from "react";
import { UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignPilgrimToRoom, unassignPilgrim } from "@/lib/actions/rooms";

type Occupant = { assignmentId: string; firstName: string; lastName: string };
type Candidate = { id: string; firstName: string; lastName: string };

export function RoomOccupants({
  roomId,
  occupants,
  candidates,
  full,
}: {
  roomId: string;
  occupants: Occupant[];
  candidates: Candidate[];
  full: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const candidateItems = Object.fromEntries(candidates.map((c) => [c.id, `${c.firstName} ${c.lastName}`]));

  function handleAssign(pilgrimId: string) {
    startTransition(async () => {
      const result = await assignPilgrimToRoom(roomId, pilgrimId);
      if (result.error) toast.error(result.error);
    });
  }

  function handleRemove(assignmentId: string) {
    startTransition(async () => {
      await unassignPilgrim(assignmentId);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      {occupants.map((occupant) => (
        <div
          key={occupant.assignmentId}
          className="flex items-center justify-between rounded-md bg-muted/60 px-2 py-1 text-sm"
        >
          <span>
            {occupant.firstName} {occupant.lastName}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={isPending}
            onClick={() => handleRemove(occupant.assignmentId)}
            aria-label="Retirer de la chambre"
          >
            <UserMinus />
          </Button>
        </div>
      ))}
      {!full && candidates.length > 0 && (
        <Select
          onValueChange={(value) => {
            if (typeof value === "string" && value) handleAssign(value);
          }}
          items={candidateItems}
          disabled={isPending}
        >
          <SelectTrigger className="w-full" size="sm">
            <SelectValue placeholder="Assigner un pèlerin..." />
          </SelectTrigger>
          <SelectContent>
            {candidates.map((candidate) => (
              <SelectItem key={candidate.id} value={candidate.id}>
                {candidate.firstName} {candidate.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {full && <p className="text-xs text-muted-foreground">Chambre complète.</p>}
    </div>
  );
}
