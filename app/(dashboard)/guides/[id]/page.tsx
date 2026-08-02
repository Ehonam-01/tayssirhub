import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { GuideForm } from "@/components/guides/guide-form";
import { GuideDeleteButton } from "@/components/guides/guide-delete-button";
import { updateGuide } from "@/lib/actions/guides";

export const dynamic = "force-dynamic";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: guide }, { data: pilgrims }] = await Promise.all([
    supabase.from("guides").select("*").eq("id", id).single(),
    supabase
      .from("pilgrims")
      .select(
        "id, first_name, last_name, phone, status, emergency_contact_name, emergency_contact_phone, campaigns(name)",
      )
      .eq("guide_id", id)
      .order("last_name", { ascending: true }),
  ]);

  if (!guide) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">{guide.full_name}</h1>
          <p className="text-sm text-muted-foreground">{pilgrims?.length ?? 0} pèlerin(s) dans son groupe</p>
        </div>
        <GuideDeleteButton id={guide.id} name={guide.full_name} />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Modifier le guide</CardTitle>
          <CardDescription>Les modifications sont visibles immédiatement par votre équipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuideForm action={updateGuide.bind(null, guide.id)} defaultValues={guide} submitLabel="Enregistrer" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Son groupe</CardTitle>
          <CardDescription>Contacts et urgences des pèlerins qu&apos;il encadre.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {!pilgrims?.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucun pèlerin assigné pour l&apos;instant. Assignez ce guide depuis la fiche d&apos;un pèlerin.
            </p>
          )}
          {pilgrims?.map((pilgrim) => (
            <div key={pilgrim.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted">
              <Link href={`/pilgrims/${pilgrim.id}`} className="flex flex-col hover:underline">
                <span className="text-sm font-medium">
                  {pilgrim.first_name} {pilgrim.last_name}
                </span>
                <span className="text-xs text-muted-foreground">{pilgrim.campaigns?.name ?? "—"}</span>
              </Link>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {pilgrim.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="size-3.5" /> {pilgrim.phone}
                  </span>
                )}
                {pilgrim.emergency_contact_phone && (
                  <span className="inline-flex items-center gap-1 text-destructive">
                    <AlertTriangle className="size-3.5" />
                    {pilgrim.emergency_contact_name ? `${pilgrim.emergency_contact_name} · ` : ""}
                    {pilgrim.emergency_contact_phone}
                  </span>
                )}
                <PilgrimStatusBadge status={pilgrim.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
