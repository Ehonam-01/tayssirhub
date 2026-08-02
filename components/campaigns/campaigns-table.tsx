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
import { CampaignStatusBadge, CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";
import { formatDate, formatMoney } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];

const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "Tous les statuts",
  draft: "Brouillon",
  open: "Ouverte",
  full: "Complète",
  closed: "Fermée",
  completed: "Terminée",
};

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.trim().toLowerCase());
      const matchesStatus = status === "all" || c.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, status]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une campagne..."
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
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_FILTER_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
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
              <TableHead>Type</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Départ</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Quota</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucune campagne ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((campaign) => (
              <TableRow key={campaign.id} className="cursor-pointer">
                <TableCell className="font-medium">
                  <Link href={`/campaigns/${campaign.id}`} className="block">
                    {campaign.name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {CAMPAIGN_TYPE_LABELS[campaign.type]}
                </TableCell>
                <TableCell>
                  <CampaignStatusBadge status={campaign.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(campaign.start_date)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatMoney(campaign.price, campaign.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground">{campaign.quota ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
