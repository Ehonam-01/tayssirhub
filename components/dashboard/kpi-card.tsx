import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface KpiTrend {
  percent: number;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  caption,
  disabled,
  trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  caption?: string;
  disabled?: boolean;
  trend?: KpiTrend;
}) {
  const isUp = (trend?.percent ?? 0) >= 0;

  return (
    <Card className={cn(disabled && "opacity-60")}>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="font-heading text-2xl font-semibold">{value}</span>
          {trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                isUp ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {isUp ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
              {isUp ? "+" : ""}
              {trend.percent.toFixed(1)}% vs mois dernier
            </span>
          ) : (
            caption && <span className="text-xs text-muted-foreground">{caption}</span>
          )}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4.5" />
        </span>
      </CardContent>
    </Card>
  );
}
