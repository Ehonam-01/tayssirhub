import { notFound } from "next/navigation";
import { BedDouble, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PilgrimForm } from "@/components/pilgrims/pilgrim-form";
import { PilgrimDeleteButton } from "@/components/pilgrims/pilgrim-delete-button";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { PilgrimPaymentsPanel } from "@/components/payments/pilgrim-payments-panel";
import { PilgrimDocumentsPanel } from "@/components/documents/pilgrim-documents-panel";
import { InvitePortalDialog } from "@/components/pilgrims/invite-portal-dialog";
import { updatePilgrim } from "@/lib/actions/pilgrims";

export const dynamic = "force-dynamic";

export default async function PilgrimDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: pilgrim },
    { data: campaigns },
    { data: guides },
    { data: payments },
    { data: documents },
    { data: roomAssignments },
    { data: portalAccess },
  ] = await Promise.all([
    supabase
      .from("pilgrims")
      .select("*, campaigns(name, price, currency), guides(full_name)")
      .eq("id", id)
      .single(),
    supabase.from("campaigns").select("id, name").order("start_date", { ascending: false }),
    supabase.from("guides").select("id, full_name").order("full_name", { ascending: true }),
    supabase
      .from("payments")
      .select("*")
      .eq("pilgrim_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("*")
      .eq("pilgrim_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("room_assignments")
      .select("id, rooms(number), hotels(name, city)")
      .eq("pilgrim_id", id),
    supabase
      .from("pilgrim_portal_access")
      .select("invited_at, claimed_at")
      .eq("pilgrim_id", id)
      .maybeSingle(),
  ]);

  if (!pilgrim) notFound();

  const totalDue = pilgrim.package_price ?? pilgrim.campaigns?.price ?? null;
  const paymentsCurrency = pilgrim.campaigns?.currency ?? "XOF";

  const fullName = `${pilgrim.first_name} ${pilgrim.last_name}`;
  const initials = `${pilgrim.first_name[0] ?? ""}${pilgrim.last_name[0] ?? ""}`.toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-semibold">{fullName}</h1>
              <PilgrimStatusBadge status={pilgrim.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {pilgrim.campaigns?.name ?? "Aucune campagne rattachée"}
              {pilgrim.guides?.full_name && (
                <span className="inline-flex items-center gap-1">
                  {" "}
                  · <UserRound className="size-3.5" /> {pilgrim.guides.full_name}
                </span>
              )}
            </p>
            {!!roomAssignments?.length && (
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground">
                {roomAssignments.map((assignment) => (
                  <span key={assignment.id} className="inline-flex items-center gap-1">
                    <BedDouble className="size-3.5" />
                    Chambre {assignment.rooms?.number} · {assignment.hotels?.name}
                    {assignment.hotels?.city ? ` (${assignment.hotels.city})` : ""}
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <InvitePortalDialog
            pilgrimId={pilgrim.id}
            hasEmail={!!pilgrim.email}
            status={
              portalAccess
                ? { invitedAt: portalAccess.invited_at, claimedAt: portalAccess.claimed_at }
                : null
            }
          />
          <PilgrimDeleteButton id={pilgrim.id} name={fullName} />
        </div>
      </div>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="mt-4">
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Modifier la fiche</CardTitle>
              <CardDescription>Les modifications sont visibles immédiatement par votre équipe.</CardDescription>
            </CardHeader>
            <CardContent>
              <PilgrimForm
                action={updatePilgrim.bind(null, pilgrim.id)}
                defaultValues={pilgrim}
                campaigns={campaigns ?? []}
                guides={guides ?? []}
                submitLabel="Enregistrer"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <PilgrimDocumentsPanel
            pilgrimId={pilgrim.id}
            agencyId={pilgrim.agency_id}
            documents={documents ?? []}
          />
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <PilgrimPaymentsPanel
            pilgrimId={pilgrim.id}
            payments={payments ?? []}
            totalDue={totalDue}
            currency={paymentsCurrency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
