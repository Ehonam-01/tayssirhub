import Link from "next/link";
import { Plus, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function GuidesPage() {
  const supabase = await createClient();

  const [{ data: guides }, { data: pilgrims }] = await Promise.all([
    supabase.from("guides").select("*").order("full_name", { ascending: true }),
    supabase.from("pilgrims").select("guide_id").not("guide_id", "is", null),
  ]);

  const countByGuide = new Map<string, number>();
  for (const pilgrim of pilgrims ?? []) {
    if (!pilgrim.guide_id) continue;
    countByGuide.set(pilgrim.guide_id, (countByGuide.get(pilgrim.guide_id) ?? 0) + 1);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Guides</h1>
          <p className="text-sm text-muted-foreground">Vos encadrants et leurs groupes de pèlerins.</p>
        </div>
        <Link href="/guides/new" className={buttonVariants()}>
          <Plus /> Ajouter un guide
        </Link>
      </div>

      {!guides?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
            <UserRound className="size-8" />
            <p className="text-sm font-medium text-foreground">Aucun guide pour l&apos;instant</p>
            <p className="max-w-sm text-sm">
              Ajoutez un guide puis assignez-lui des pèlerins depuis leur fiche.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guides/${guide.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <UserRound className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{guide.full_name}</p>
                    <p className="text-xs text-muted-foreground">{guide.phone ?? "—"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {countByGuide.get(guide.id) ?? 0} pèlerin(s) dans son groupe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
