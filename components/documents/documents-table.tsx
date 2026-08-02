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
import { DocumentStatusBadge } from "@/components/documents/document-status-badge";
import { DocumentRowActions } from "@/components/documents/document-row-actions";
import { DOCUMENT_TYPE_LABELS, DOCUMENT_STATUS_LABELS } from "@/lib/document-labels";
import { DOCUMENT_TYPES } from "@/lib/validations/document";
import { formatDate } from "@/lib/format";
import type { Database } from "@/lib/types/database";

type Document = Database["public"]["Tables"]["documents"]["Row"] & {
  pilgrims: { first_name: string; last_name: string } | null;
};

const TYPE_FILTER_LABELS: Record<string, string> = { all: "Tous les types", ...DOCUMENT_TYPE_LABELS };
const STATUS_FILTER_LABELS: Record<string, string> = {
  all: "Tous les statuts",
  en_attente: DOCUMENT_STATUS_LABELS.en_attente,
  valide: DOCUMENT_STATUS_LABELS.valide,
  rejete: DOCUMENT_STATUS_LABELS.rejete,
};

export function DocumentsTable({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return documents.filter((document) => {
      const name = `${document.pilgrims?.first_name ?? ""} ${document.pilgrims?.last_name ?? ""}`.toLowerCase();
      const matchesSearch = name.includes(query) || document.file_name.toLowerCase().includes(query);
      const matchesStatus = status === "all" || document.status === status;
      const matchesType = type === "all" || document.type === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [documents, search, status, type]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un pèlerin ou un fichier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={type} onValueChange={(value) => setType(value ?? "all")} items={TYPE_FILTER_LABELS}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {DOCUMENT_TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {DOCUMENT_TYPE_LABELS[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value ?? "all")}
          items={STATUS_FILTER_LABELS}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="valide">Validé</SelectItem>
            <SelectItem value="rejete">Rejeté</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pèlerin</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Ajouté le</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Aucun document ne correspond à votre recherche.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">
                  <Link href={`/pilgrims/${document.pilgrim_id}`} className="hover:underline">
                    {document.pilgrims?.first_name} {document.pilgrims?.last_name}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{document.file_name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {DOCUMENT_TYPE_LABELS[document.type]}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(document.created_at)}
                </TableCell>
                <TableCell>
                  <DocumentStatusBadge status={document.status} expiryDate={document.expiry_date} />
                </TableCell>
                <TableCell>
                  <DocumentRowActions document={document} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
