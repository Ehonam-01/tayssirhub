import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AddPricingPlanDialog } from "@/components/admin/add-pricing-plan-dialog";
import { PricingPlanRowActions } from "@/components/admin/pricing-plan-row-actions";
import { formatMoney } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("pricing_plans")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Tarifs</h1>
          <p className="text-sm text-muted-foreground">
            Les offres affichées sur la landing page publique — rien n&apos;est codé en dur côté front.
          </p>
        </div>
        <AddPricingPlanDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offres</CardTitle>
          <CardDescription>{plans?.length ?? 0} offre(s), triées par ordre d&apos;affichage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix mensuel</TableHead>
                  <TableHead>Prix annuel</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!plans?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      Aucune offre pour l&apos;instant.
                    </TableCell>
                  </TableRow>
                )}
                {plans?.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">
                      {plan.name}
                      {plan.is_popular && (
                        <Badge variant="secondary" className="ml-2">
                          Populaire
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {plan.is_custom_pricing ? "Sur devis" : formatMoney(plan.price_monthly, plan.currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {plan.is_custom_pricing ? "Sur devis" : formatMoney(plan.price_yearly, plan.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={plan.is_published ? "default" : "outline"}>
                        {plan.is_published ? "Publiée" : "Brouillon"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PricingPlanRowActions plan={plan} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
