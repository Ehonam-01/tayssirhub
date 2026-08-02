import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CrmStageSelect } from "@/components/crm/crm-stage-select";
import { CRM_STAGES, CRM_STAGE_LABELS } from "@/lib/crm-labels";
import type { Database } from "@/lib/types/database";

type Pilgrim = Database["public"]["Tables"]["pilgrims"]["Row"] & {
  campaigns: { name: string } | null;
};

export function CrmBoard({ pilgrims }: { pilgrims: Pilgrim[] }) {
  const byStage = new Map<string, Pilgrim[]>();
  for (const pilgrim of pilgrims) {
    const list = byStage.get(pilgrim.crm_stage) ?? [];
    list.push(pilgrim);
    byStage.set(pilgrim.crm_stage, list);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {CRM_STAGES.map((stage) => {
        const stagePilgrims = byStage.get(stage) ?? [];
        return (
          <div key={stage} className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-medium">{CRM_STAGE_LABELS[stage]}</h2>
              <Badge variant="secondary">{stagePilgrims.length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {stagePilgrims.length === 0 && (
                <p className="rounded-lg border border-dashed border-border px-2 py-4 text-center text-xs text-muted-foreground">
                  Aucun pèlerin
                </p>
              )}
              {stagePilgrims.map((pilgrim) => (
                <Card key={pilgrim.id}>
                  <CardContent className="flex flex-col gap-2">
                    <Link href={`/pilgrims/${pilgrim.id}`} className="hover:underline">
                      <p className="text-sm font-medium">
                        {pilgrim.first_name} {pilgrim.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pilgrim.campaigns?.name ?? pilgrim.phone ?? "—"}
                      </p>
                    </Link>
                    <CrmStageSelect pilgrimId={pilgrim.id} stage={pilgrim.crm_stage} />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
