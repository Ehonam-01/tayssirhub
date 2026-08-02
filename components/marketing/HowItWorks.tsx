import { Building2, CalendarPlus, UserPlus, Activity, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

const STEPS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Building2,
    title: "Créez votre agence",
    description: "Un compte, quelques informations, votre espace Tayssir est prêt.",
  },
  {
    icon: CalendarPlus,
    title: "Créez votre pèlerinage",
    description: "Hajj, Oumra, Ramadan ou voyage sur mesure — définissez dates, prix et quota.",
  },
  {
    icon: UserPlus,
    title: "Ajoutez les pèlerins",
    description: "Dossier, documents, paiements : chaque inscription en quelques minutes.",
  },
  {
    icon: Activity,
    title: "Suivez votre activité",
    description: "Paiements reçus, documents en attente, départs à venir — en un coup d'œil.",
  },
  {
    icon: Gauge,
    title: "Pilotez votre agence",
    description: "Rapports, comptabilité et statistiques pour décider avec des données fiables.",
  },
];

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-y border-border bg-secondary/30 dark:bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Cinq étapes, et votre agence tourne sur Tayssir.</p>
        </FadeIn>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <FadeIn key={step.title} delay={i * 0.08} className="relative flex flex-col items-center gap-3 text-center">
              {i < STEPS.length - 1 && (
                <span className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border lg:block" />
              )}
              <span className="relative flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="size-5" />
                <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-gold text-[0.65rem] font-semibold text-gold-foreground">
                  {i + 1}
                </span>
              </span>
              <h3 className="font-heading text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
