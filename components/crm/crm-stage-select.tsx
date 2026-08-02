"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CRM_STAGES, CRM_STAGE_LABELS } from "@/lib/crm-labels";
import { updateCrmStage } from "@/lib/actions/pilgrims";

export function CrmStageSelect({ pilgrimId, stage }: { pilgrimId: string; stage: string }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string | null) {
    if (!value || value === stage) return;
    startTransition(async () => {
      const result = await updateCrmStage(pilgrimId, value);
      if (result.error) toast.error(result.error);
    });
  }

  return (
    <Select value={stage} onValueChange={handleChange} items={CRM_STAGE_LABELS} disabled={isPending}>
      <SelectTrigger size="sm" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CRM_STAGES.map((value) => (
          <SelectItem key={value} value={value}>
            {CRM_STAGE_LABELS[value]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
