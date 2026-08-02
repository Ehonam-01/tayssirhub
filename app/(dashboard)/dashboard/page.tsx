import Link from "next/link";
import { Users, CalendarCheck, CalendarClock, AlertTriangle, Wallet, Clock, IdCard, PiggyBank } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { getDateWindow, getMonthWindow } from "@/lib/dates";
import { KpiCard, type KpiTrend } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignStatusBadge, CAMPAIGN_TYPE_LABELS } from "@/components/campaigns/campaign-status-badge";
import { PilgrimStatusBadge } from "@/components/pilgrims/pilgrim-status-badge";
import { formatDate, formatGroupedMoney } from "@/lib/format";
import { computeMargin, sumByCurrency, type CurrencyTotal } from "@/lib/accounting";

export const dynamic = "force-dynamic";

// Une seule devise en jeu sur les deux mois comparés : sinon un pourcentage
// unique n'aurait pas de sens (on ne mélange jamais des devises, même logique
// que formatGroupedMoney). Pas de mois précédent exploitable (0) : pas de
// tendance affichable plutôt qu'une division par zéro.
function computeTrend(current: CurrencyTotal[], previous: CurrencyTotal[]): KpiTrend | undefined {
  const currencies = new Set([...current, ...previous].map((row) => row.currency));
  if (currencies.size !== 1) return undefined;

  const currentTotal = current[0]?.amount ?? 0;
  const previousTotal = previous[0]?.amount ?? 0;
  if (previousTotal === 0) return undefined;

  return { percent: ((currentTotal - previousTotal) / Math.abs(previousTotal)) * 100 };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const profile = await getCurrentProfile();

  const { from: today, until: in30Days } = getDateWindow(30);
  const { start: monthStart, end: monthEnd } = getMonthWindow();
  const { start: lastMonthStart, end: lastMonthEnd } = getMonthWindow(1);

  const [
    { count: pilgrimsCount },
    { count: activeCampaignsCount },
    { count: incompleteCount },
    { count: upcomingCount },
    { data: upcomingCampaigns },
    { data: recentPilgrims },
    { data: paymentsReceivedThisMonth },
    { data: paymentsPending },
    { count: visasPendingCount },
    { data: expensesThisMonth },
    { data: paymentsReceivedLastMonth },
    { data: expensesLastMonth },
  ] = await Promise.all([
    supabase.from("pilgrims").select("*", { count: "exact", head: true }),
    supabase.from("campaigns").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("pilgrims")
      .select("*", { count: "exact", head: true })
      .eq("status", "dossier_incomplet"),
    supabase
      .from("campaigns")
      .select("*", { count: "exact", head: true })
      .gte("start_date", today)
      .lte("start_date", in30Days),
    supabase
      .from("campaigns")
      .select("id, name, type, status, start_date")
      .gte("start_date", today)
      .order("start_date", { ascending: true })
      .limit(5),
    supabase
      .from("pilgrims")
      .select("id, first_name, last_name, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("payments")
      .select("amount, currency")
      .eq("status", "paid")
      .gte("paid_at", monthStart)
      .lt("paid_at", monthEnd),
    supabase.from("payments").select("amount, currency").eq("status", "scheduled"),
    supabase
      .from("documents")
      .select("*", { count: "exact", head: true })
      .eq("type", "visa")
      .eq("status", "en_attente"),
    supabase
      .from("expenses")
      .select("amount, currency")
      .gte("expense_date", monthStart)
      .lt("expense_date", monthEnd),
    supabase
      .from("payments")
      .select("amount, currency")
      .eq("status", "paid")
      .gte("paid_at", lastMonthStart)
      .lt("paid_at", lastMonthEnd),
    supabase
      .from("expenses")
      .select("amount, currency")
      .gte("expense_date", lastMonthStart)
      .lt("expense_date", lastMonthEnd),
  ]);

  const revenueTotalsThisMonth = sumByCurrency(paymentsReceivedThisMonth ?? []);
  const expenseTotalsThisMonth = sumByCurrency(expensesThisMonth ?? []);
  const marginThisMonth = computeMargin(revenueTotalsThisMonth, expenseTotalsThisMonth);
  const marginLastMonth = computeMargin(
    sumByCurrency(paymentsReceivedLastMonth ?? []),
    sumByCurrency(expensesLastMonth ?? []),
  );

  const revenueTrend = computeTrend(revenueTotalsThisMonth, sumByCurrency(paymentsReceivedLastMonth ?? []));
  const marginTrend = computeTrend(marginThisMonth, marginLastMonth);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">
          Bon retour{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground">{formatDate(new Date().toISOString(), "EEEE d MMMM yyyy")}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <KpiCard label="Pèlerins" value={pilgrimsCount ?? 0} icon={Users} />
        <KpiCard label="Campagnes actives" value={activeCampaignsCount ?? 0} icon={CalendarCheck} />
        <KpiCard
          label="Départs (30j)"
          value={upcomingCount ?? 0}
          icon={CalendarClock}
        />
        <KpiCard
          label="Dossiers incomplets"
          value={incompleteCount ?? 0}
          icon={AlertTriangle}
        />
        <KpiCard
          label="Paiements reçus"
          value={formatGroupedMoney(paymentsReceivedThisMonth ?? [])}
          icon={Wallet}
          caption="Ce mois-ci"
          trend={revenueTrend}
        />
        <KpiCard
          label="Paiements en attente"
          value={formatGroupedMoney(paymentsPending ?? [])}
          icon={Clock}
          caption="Échéances planifiées"
        />
        <KpiCard
          label="Visas en attente"
          value={visasPendingCount ?? 0}
          icon={IdCard}
        />
        <KpiCard
          label="Bénéfice"
          value={formatGroupedMoney(marginThisMonth)}
          icon={PiggyBank}
          caption="Ce mois-ci"
          trend={marginTrend}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prochains départs</CardTitle>
            <Link href="/campaigns" className="text-sm text-muted-foreground hover:text-foreground">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {!upcomingCampaigns?.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucun départ programmé pour l&apos;instant.
              </p>
            )}
            {upcomingCampaigns?.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{campaign.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {CAMPAIGN_TYPE_LABELS[campaign.type]} · {formatDate(campaign.start_date)}
                  </span>
                </div>
                <CampaignStatusBadge status={campaign.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pèlerins récents</CardTitle>
            <Link href="/pilgrims" className="text-sm text-muted-foreground hover:text-foreground">
              Voir tout
            </Link>
          </CardHeader>
          <CardContent className="flex flex-col gap-1">
            {!recentPilgrims?.length && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Aucun pèlerin enregistré pour l&apos;instant.
              </p>
            )}
            {recentPilgrims?.map((pilgrim) => (
              <Link
                key={pilgrim.id}
                href={`/pilgrims/${pilgrim.id}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 hover:bg-muted"
              >
                <span className="text-sm font-medium">
                  {pilgrim.first_name} {pilgrim.last_name}
                </span>
                <PilgrimStatusBadge status={pilgrim.status} />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
