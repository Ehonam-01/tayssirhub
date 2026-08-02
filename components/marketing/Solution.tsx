import { Users, Wallet, FileText, BedDouble, Plane, Landmark, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

const MODULES: { icon: LucideIcon; label: string }[] = [
  { icon: Users, label: "Pèlerins" },
  { icon: Wallet, label: "Paiements" },
  { icon: FileText, label: "Documents" },
  { icon: BedDouble, label: "Chambres" },
  { icon: Plane, label: "Vols" },
  { icon: UserRound, label: "Guides" },
  { icon: Landmark, label: "Comptabilité" },
];

export function Solution() {
  return (
    <section className="border-b border-border bg-secondary/30 dark:bg-card/20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-24">
        <FadeIn>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Tayssir remet tout au même endroit.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Plus besoin de jongler entre dix outils. Chaque pèlerin, chaque paiement, chaque
            document et chaque groupe vit dans une seule plateforme — accessible à toute votre
            équipe, à jour en temps réel.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Vous ne changez pas votre façon de travailler pour vous adapter à un logiciel : Tayssir
            a été pensé autour du métier des agences de pèlerinage, du premier contact au retour du
            voyage.
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-2xl bg-card p-6 shadow-xl shadow-primary/5 ring-1 ring-foreground/10">
            <div className="grid grid-cols-3 gap-3">
              {MODULES.slice(0, 3).map((m) => (
                <ModuleTile key={m.label} {...m} />
              ))}
              <div className="col-span-1 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-primary p-4 text-center text-primary-foreground">
                <span className="font-heading text-lg font-semibold">Tayssir</span>
                <span className="text-[0.65rem] text-primary-foreground/70">tout centralisé</span>
              </div>
              {MODULES.slice(3).map((m) => (
                <ModuleTile key={m.label} {...m} />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

function ModuleTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary/60 p-4 text-center dark:bg-muted/40">
      <Icon className="size-4.5 text-gold" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );
}
