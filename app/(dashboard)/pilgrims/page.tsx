import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { PilgrimsTable } from "@/components/pilgrims/pilgrims-table";

export const dynamic = "force-dynamic";

export default async function PilgrimsPage() {
  const supabase = await createClient();
  const { data: pilgrims } = await supabase
    .from("pilgrims")
    .select("*, campaigns(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Pèlerins</h1>
          <p className="text-sm text-muted-foreground">
            Prospects, inscrits et dossiers en cours.
          </p>
        </div>
        <Link href="/pilgrims/new" className={buttonVariants()}>
          <Plus /> Nouveau pèlerin
        </Link>
      </div>

      <PilgrimsTable pilgrims={pilgrims ?? []} />
    </div>
  );
}
