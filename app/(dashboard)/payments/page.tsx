import { createClient } from "@/lib/supabase/server";
import { PaymentsTable } from "@/components/payments/payments-table";
import { AddPaymentDialog } from "@/components/payments/add-payment-dialog";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const supabase = await createClient();
  const [{ data: payments }, { data: pilgrims }] = await Promise.all([
    supabase
      .from("payments")
      .select("*, pilgrims(first_name, last_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("pilgrims")
      .select("id, first_name, last_name")
      .order("last_name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Paiements</h1>
          <p className="text-sm text-muted-foreground">
            Échéances et historique des paiements de tous vos pèlerins.
          </p>
        </div>
        <AddPaymentDialog pilgrims={pilgrims ?? []} />
      </div>

      <PaymentsTable payments={payments ?? []} />
    </div>
  );
}
