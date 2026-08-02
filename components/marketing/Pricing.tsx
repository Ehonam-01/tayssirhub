import { createClient } from "@/lib/supabase/server";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { FadeIn } from "@/components/marketing/fade-in";

// Aucun prix codé en dur : les offres viennent de pricing_plans (Supabase),
// éditables depuis /admin/pricing par un compte is_super_admin.
export async function Pricing() {
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (
    <section id="tarifs" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Une offre pour chaque taille d&apos;agence
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Commencez simplement, évoluez sans changer d&apos;outil.
        </p>
      </FadeIn>

      <div className="mt-14">
        {plans?.length ? (
          <PricingCards plans={plans} />
        ) : (
          <p className="text-center text-muted-foreground">
            Les offres seront bientôt disponibles ici.
          </p>
        )}
      </div>
    </section>
  );
}
