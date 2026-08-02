"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { PILGRIM_STATUSES } from "@/lib/validations/pilgrim";
import type { Database } from "@/lib/types/database";

type Pilgrim = Database["public"]["Tables"]["pilgrims"]["Row"] & {
  campaigns: { name: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  prospect: "Prospect",
  inscrit: "Inscrit",
  dossier_incomplet: "Dossier incomplet",
  dossier_complet: "Dossier complet",
  confirme: "Confirmé",
  parti: "Parti",
  revenu: "Revenu",
  annule: "Annulé",
};

const STATUS_FILTER_LABELS: Record<string, string> = { all: "Tous les statuts", ...STATUS_LABELS };

export function PilgrimsTable({ pilgrims }: { pilgrims: Pilgrim[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pilgrims.filter((p) => {
      const fullName = `${p.first_name} ${p.last_name}`.toLowerCase();
      const matchesSearch = fullName.includes(query);
      const matchesStatus = status === "all" || p.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [pilgrims, search, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pèlerin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value ?? "all")}
          items={STATUS_FILTER_LABELS}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {PILGRIM_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {STATUS_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Campagne</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  Aucun pèlerin ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((pilgrim) => (
              <TableRow key={pilgrim.id}>
                <TableCell className="font-medium">
                  <Link href={`/pilgrims/${pilgrim.id}`} className="block">
                    {pilgrim.first_name} {pilgrim.last_name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{pilgrim.phone ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {pilgrim.campaigns?.name ?? "—"}
                </TableCell>
                <TableCell>
                  <PilgrimStatusBadge status={pilgrim.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
