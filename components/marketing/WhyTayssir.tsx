import { Clock, ShieldCheck, Layers, LineChart, Users2, Cloud, Lock, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Clock,
    title: "Gain de temps",
    description: "Moins de saisie manuelle, moins d'allers-retours entre outils.",
  },
  {
    icon: ShieldCheck,
    title: "Moins d'erreurs",
    description: "Les données sont saisies une fois, et réutilisées partout dans l'agence.",
  },
  {
    icon: Layers,
    title: "Centralisation",
    description: "Un seul endroit pour les pèlerins, les paiements et les documents.",
  },
  {
    icon: LineChart,
    title: "Suivi financier",
    description: "Recettes, dépenses et marge visibles campagne par campagne.",
  },
  {
    icon: Users2,
    title: "Collaboration",
    description: "Toute l'équipe travaille sur les mêmes informations, à jour en temps réel.",
  },
  {
    icon: Cloud,
    title: "100 % cloud",
    description: "Aucune installation, aucune mise à jour à gérer.",
  },
  {
    icon: Lock,
    title: "Sécurité",
    description: "Chaque agence est strictement isolée des autres, au niveau de la base de données.",
  },
  {
    icon: RefreshCw,
    title: "Sauvegardes automatiques",
    description: "Vos données sont sauvegardées sans action de votre part.",
  },
];

export function WhyTayssir() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Gagnez plusieurs heures chaque semaine
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Avec Tayssir, votre équipe passe moins de temps sur l&apos;administratif et davantage auprès
          de vos pèlerins — avec moins d&apos;erreurs et une organisation plus professionnelle.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((benefit, i) => (
          <FadeIn key={benefit.title} delay={(i % 4) * 0.05} className="flex flex-col gap-2.5 rounded-xl p-4">
            <benefit.icon className="size-5 text-gold" />
            <h3 className="text-sm font-semibold">{benefit.title}</h3>
            <p className="text-xs text-muted-foreground">{benefit.description}</p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
