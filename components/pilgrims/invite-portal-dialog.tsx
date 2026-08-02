"use client";

import { useState, useTransition } from "react";
import { Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { invitePilgrimToPortal } from "@/lib/actions/pilgrim-portal-access";

export function InvitePortalDialog({
  pilgrimId,
  hasEmail,
  status,
}: {
  pilgrimId: string;
  hasEmail: boolean;
  status: { invitedAt: string | null; claimedAt: string | null } | null;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (status?.claimedAt) {
    return <Badge>Portail actif depuis le {formatDate(status.claimedAt)}</Badge>;
  }

  function handleInvite() {
    setError(null);
    startTransition(async () => {
      const result = await invitePilgrimToPortal(pilgrimId);
      if (result.error) setError(result.error);
      if (result.inviteUrl) setInviteUrl(`${window.location.origin}${result.inviteUrl}`);
    });
  }

  function handleCopy() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setInviteUrl(null);
          setError(null);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            disabled={!hasEmail}
            title={hasEmail ? undefined : "Ajoutez un email au dossier pour activer le portail"}
          >
            <Mail /> {status?.invitedAt ? "Ré-inviter au portail" : "Inviter au portail"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inviter au portail pèlerin</DialogTitle>
          <DialogDescription>
            Transmettez ce lien vous-même (WhatsApp, email...) — le pèlerin l&apos;ouvre pour
            activer son accès en lecture seule à son dossier.
          </DialogDescription>
        </DialogHeader>

        {!inviteUrl ? (
          <Button onClick={handleInvite} disabled={pending} className="self-start">
            {pending ? "Génération..." : "Générer le lien"}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input readOnly value={inviteUrl} />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copier le lien">
              {copied ? <Check /> : <Copy />}
            </Button>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}
