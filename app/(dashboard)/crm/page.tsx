import { createClient } from "@/lib/supabase/server";
import { CrmBoard } from "@/components/crm/crm-board";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const supabase = await createClient();
  const { data: pilgrims } = await supabase
    .from("pilgrims")
    .select("*, campaigns(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">CRM</h1>
        <p className="text-sm text-muted-foreground">
          Pipeline commercial : de la prospection au voyage terminé.
        </p>
      </div>

      <CrmBoard pilgrims={pilgrims ?? []} />
    </div>
  );
}
