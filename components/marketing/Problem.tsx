import { FileSpreadsheet, MessageCircleWarning, Users, FolderX, PhoneCall, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

const PAINS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: FileSpreadsheet,
    title: "Des fichiers Excel qui se contredisent",
    description: "Trois versions du même tableau, personne ne sait laquelle est à jour.",
  },
  {
    icon: MessageCircleWarning,
    title: "Des paiements dispersés",
    description: "Un versement noté sur WhatsApp, un autre sur un carnet — le reliquat réel est une devinette.",
  },
  {
    icon: Users,
    title: "Des groupes difficiles à suivre",
    description: "Qui est dans quel bus, quelle chambre, quel vol ? La réponse change selon qui vous demandez.",
  },
  {
    icon: FolderX,
    title: "Des documents perdus",
    description: "Un passeport égaré la veille du départ, un visa introuvable au comptoir d'embarquement.",
  },
  {
    icon: PhoneCall,
    title: "Des appels permanents",
    description: "\"Où en est mon dossier ?\" — la même question, dix fois par jour, sur dix canaux différents.",
  },
  {
    icon: AlertTriangle,
    title: "Des erreurs humaines coûteuses",
    description: "Une chambre mal attribuée, une échéance oubliée : chaque erreur retombe sur votre équipe.",
  },
];

export function Problem() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
      <FadeIn>
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Organiser un pèlerinage est une immense responsabilité.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Et la plupart des agences la portent encore avec des outils qui n&apos;ont pas été conçus pour ça.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
        {PAINS.map((pain, i) => (
          <FadeIn key={pain.title} delay={i * 0.05}>
            <div className="flex h-full flex-col gap-3 rounded-2xl bg-card p-5 ring-1 ring-foreground/10">
              <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <pain.icon className="size-4.5" />
              </span>
              <h3 className="font-heading text-base font-semibold">{pain.title}</h3>
              <p className="text-sm text-muted-foreground">{pain.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.1}>
        <p className="mt-14 text-xl font-medium text-balance">
          Chaque erreur peut coûter cher — à votre agence, et à la confiance de vos pèlerins.
        </p>
      </FadeIn>
    </section>
  );
}
