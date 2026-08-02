import Link from "next/link";
import { Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const REPORTS = [
  {
    key: "pilgrims",
    title: "Pèlerins",
    description: "Liste complète des pèlerins : statut, campagne, guide, étape CRM.",
  },
  {
    key: "payments",
    title: "Paiements",
    description: "Historique des échéances planifiées et des paiements reçus.",
  },
  {
    key: "campaigns",
    title: "Campagnes",
    description: "Vue d'ensemble des campagnes et du nombre d'inscrits.",
  },
  {
    key: "expenses",
    title: "Dépenses",
    description: "Toutes les dépenses enregistrées, générales ou par campagne.",
  },
] as const;

export default async function ReportsPage() {
  const supabase = await createClient();

  const [{ count: pilgrimsCount }, { count: paymentsCount }, { count: campaignsCount }, { count: expensesCount }] =
    await Promise.all([
      supabase.from("pilgrims").select("*", { count: "exact", head: true }),
      supabase.from("payments").select("*", { count: "exact", head: true }),
      supabase.from("campaigns").select("*", { count: "exact", head: true }),
      supabase.from("expenses").select("*", { count: "exact", head: true }),
    ]);

  const counts: Record<string, number> = {
    pilgrims: pilgrimsCount ?? 0,
    payments: paymentsCount ?? 0,
    campaigns: campaignsCount ?? 0,
    expenses: expensesCount ?? 0,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Rapports</h1>
        <p className="text-sm text-muted-foreground">Exportez vos données en CSV, Excel ou PDF.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {REPORTS.map((report) => (
          <Card key={report.key}>
            <CardHeader>
              <CardTitle>{report.title}</CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">{counts[report.key]} ligne(s)</p>
              <div className="flex gap-2">
                <Link
                  href={`/api/reports/${report.key}?format=csv`}
                  target="_blank"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Download /> CSV
                </Link>
                <Link
                  href={`/api/reports/${report.key}?format=xlsx`}
                  target="_blank"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  <Download /> Excel
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>Rapport comptable</CardTitle>
            <CardDescription>Recettes, dépenses et marge par campagne, en document PDF.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">Document formaté, prêt à partager</p>
            <Link
              href="/api/reports/accounting"
              target="_blank"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Download /> PDF
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
