"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/marketing/fade-in";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/types/database";

type PricingPlan = Database["public"]["Tables"]["pricing_plans"]["Row"];

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// L'économie annuelle n'est jamais stockée : calculée ici à partir des deux
// prix, même principe "dérivé, jamais stocké" que le reste de l'app.
function yearlySavingsPercent(plan: PricingPlan) {
  if (!plan.price_monthly || !plan.price_yearly) return null;
  const costOverYearIfMonthly = plan.price_monthly * 12;
  if (costOverYearIfMonthly <= 0) return null;
  const savings = costOverYearIfMonthly - plan.price_yearly;
  if (savings <= 0) return null;
  return Math.round((savings / costOverYearIfMonthly) * 100);
}

export function PricingCards({ plans }: { plans: PricingPlan[] }) {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="inline-flex items-center gap-1 rounded-full bg-secondary p-1 dark:bg-muted">
        <button
          type="button"
          onClick={() => setYearly(false)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            !yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          Mensuel
        </button>
        <button
          type="button"
          onClick={() => setYearly(true)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            yearly ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
          )}
        >
          Annuel
        </button>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => {
          const savings = yearlySavingsPercent(plan);
          const price = yearly ? plan.price_yearly : plan.price_monthly;

          return (
            <FadeIn key={plan.id} delay={i * 0.08}>
              <div
                className={cn(
                  "flex h-full flex-col items-center gap-6 rounded-2xl p-6 text-center sm:items-start sm:text-left",
                  plan.is_popular
                    ? "bg-primary text-primary-foreground ring-2 ring-gold"
                    : "bg-card ring-1 ring-foreground/10",
                )}
              >
                {plan.is_popular && (
                  <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
                    <Sparkles className="size-3" /> Le plus populaire
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
                  {plan.description && (
                    <p
                      className={cn(
                        "mt-1 text-sm",
                        plan.is_popular ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      {plan.description}
                    </p>
                  )}
                </div>

                <div>
                  {plan.is_custom_pricing || !price ? (
                    <p className="font-heading text-3xl font-semibold">Sur devis</p>
                  ) : (
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-heading text-3xl font-semibold">{formatPrice(price, plan.currency)}</span>
                      <span
                        className={cn(
                          "text-sm",
                          plan.is_popular ? "text-primary-foreground/70" : "text-muted-foreground",
                        )}
                      >
                        / {yearly ? "an" : "mois"}
                      </span>
                    </div>
                  )}
                  {yearly && savings && !plan.is_custom_pricing && (
                    <p className="mt-1 text-xs font-medium text-gold">Économisez {savings} % à l&apos;année</p>
                  )}
                  {plan.has_free_trial && (
                    <p
                      className={cn(
                        "mt-1 text-xs",
                        plan.is_popular ? "text-primary-foreground/70" : "text-muted-foreground",
                      )}
                    >
                      Essai gratuit {plan.trial_days ? `${plan.trial_days} jours` : ""}
                    </p>
                  )}
                </div>

                <ul className="flex flex-1 flex-col items-center gap-2.5 sm:items-start">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={cn(buttonVariants({ variant: plan.is_popular ? "secondary" : "default" }), "w-full")}
                >
                  {plan.cta_label}
                </Link>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
