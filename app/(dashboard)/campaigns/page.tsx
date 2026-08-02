import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buttonVariants } from "@/components/ui/button";
import { CampaignsTable } from "@/components/campaigns/campaigns-table";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .order("start_date", { ascending: true, nullsFirst: false });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Campagnes</h1>
          <p className="text-sm text-muted-foreground">
            Vos voyages Hajj, Oumra et Ramadan.
          </p>
        </div>
        <Link href="/campaigns/new" className={buttonVariants()}>
          <Plus /> Nouvelle campagne
        </Link>
      </div>

      <CampaignsTable campaigns={campaigns ?? []} />
    </div>
  );
}
