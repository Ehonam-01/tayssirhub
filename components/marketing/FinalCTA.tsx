import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { GeometricPattern } from "@/components/marketing/geometric-pattern";
import { FadeIn } from "@/components/marketing/fade-in";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <GeometricPattern id="tayssir-geo-cta" className="pointer-events-none absolute inset-0 size-full text-gold/[0.08]" />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-24 text-center sm:px-6">
        <FadeIn>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Prêt à moderniser votre agence ?
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="max-w-xl text-lg text-primary-foreground/75">
            Rejoignez les agences qui simplifient déjà la gestion de leurs pèlerinages avec une
            plateforme pensée spécialement pour leurs besoins.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="max-w-xl text-primary-foreground/75">
            Réservez dès aujourd&apos;hui une démonstration gratuite et découvrez comment gagner du
            temps, réduire les erreurs et offrir un meilleur service à vos pèlerins.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href="/signup"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-3 h-12 px-8 text-base")}
          >
            Demander une démonstration gratuite
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
