import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  CalendarRange,
  Wallet,
  FileText,
  UsersRound,
  LayoutDashboard,
  Smartphone,
  Tablet,
  Building2,
  Home as HomeIcon,
  Star,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CHECKLIST = [
  "Gestion des réservations",
  "Suivi des paiements",
  "Gestion des pèlerins",
  "Documents administratifs",
  "Rapports automatiques",
  "Accessible partout et sur tous les appareils",
];

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  itemsIntro?: string;
  items: string[];
  footnote?: string;
}

const FEATURES: Feature[] = [
  {
    icon: Users,
    title: "Gestion complète des pèlerins",
    description: "Enregistrez chaque pèlerin en quelques secondes.",
    items: [
      "Informations personnelles",
      "Passeport",
      "Contacts d'urgence",
      "Photos",
      "Documents",
      "Historique des voyages",
    ],
  },
  {
    icon: CalendarRange,
    title: "Réservations simplifiées",
    description: "Créez rapidement vos départs.",
    items: ["Hajj", "Oumra", "Ramadan", "Voyages personnalisés"],
    footnote: "Suivez le nombre de places disponibles en temps réel.",
  },
  {
    icon: Wallet,
    title: "Gestion des paiements",
    description: "Ne perdez plus le suivi des versements.",
    items: ["Paiements partiels", "Soldes restants", "Reçus automatiques", "Historique complet"],
  },
  {
    icon: FileText,
    title: "Gestion documentaire",
    description: "Centralisez tous les documents importants.",
    items: ["Passeports", "Visas", "Billets d'avion", "Assurances", "Contrats", "Autorisations"],
    footnote: "Chaque document reste disponible en quelques clics.",
  },
  {
    icon: UsersRound,
    title: "Gestion des groupes",
    description: "Créez facilement plusieurs groupes de pèlerins.",
    itemsIntro: "Attribuez :",
    items: ["Guides", "Chambres", "Bus", "Hôtels", "Vols"],
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord intelligent",
    description: "Visualisez immédiatement :",
    items: ["Nombre de pèlerins", "Paiements reçus", "Soldes à récupérer", "Départs à venir", "Voyages terminés"],
    footnote: "Toutes vos statistiques sont disponibles en temps réel.",
  },
];

const DEVICES: { icon: LucideIcon; label: string }[] = [
  { icon: Building2, label: "votre bureau" },
  { icon: HomeIcon, label: "votre domicile" },
  { icon: Smartphone, label: "votre téléphone" },
  { icon: Tablet, label: "votre tablette" },
];

const SECURITY = [
  "Sauvegardes automatiques",
  "Connexion sécurisée",
  "Données chiffrées",
  "Hébergement fiable",
  "Accès contrôlés selon les rôles",
];

const TESTIMONIALS = [
  {
    quote:
      "Depuis que nous utilisons cette plateforme, nous avons complètement abandonné nos fichiers Excel. Toute notre équipe travaille plus rapidement.",
    role: "Agence de pèlerinage",
  },
  {
    quote: "Le suivi des paiements est devenu extrêmement simple.",
    role: "Responsable d'agence",
  },
  {
    quote: "Nous retrouvons instantanément toutes les informations de nos pèlerins.",
    role: "Coordinateur de voyages",
  },
];

const FAQS = [
  {
    question: "Puis-je gérer plusieurs départs simultanément ?",
    answer: "Oui. Vous pouvez créer autant de voyages que nécessaire.",
  },
  {
    question: "Les données sont-elles sécurisées ?",
    answer: "Oui. Toutes les données sont protégées et sauvegardées automatiquement.",
  },
  {
    question: "Puis-je accéder au logiciel depuis mon téléphone ?",
    answer: "Oui. La plateforme fonctionne sur ordinateur, tablette et smartphone.",
  },
  {
    question: "Une formation est-elle prévue ?",
    answer: "Oui. Nous vous accompagnons lors de la prise en main.",
  },
];

const ctaButtonClass = cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base");

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-semibold text-primary-foreground">
              O
            </span>
            <span className="font-heading text-base font-semibold">Oumra CRM</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
            >
              Connexion
            </Link>
            <Link href="/signup" className={buttonVariants({ size: "sm" })}>
              Demander une démo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border bg-secondary/40 dark:bg-background">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            Le logiciel tout-en-un pour gérer vos pèlerinages en toute sérénité
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Organisez vos voyages de Hajj, Oumra, Ramadan et tous vos pèlerinages depuis une seule plateforme.
          </p>
          <div className="max-w-2xl space-y-3 text-muted-foreground">
            <p>Fini les fichiers Excel, les dossiers papier et les informations dispersées sur WhatsApp.</p>
            <p>
              Notre solution SaaS permet aux agences de pèlerinage de centraliser les réservations, suivre chaque
              pèlerin, gérer les paiements, les documents administratifs et coordonner toute l&apos;organisation
              depuis un tableau de bord moderne.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-2 text-left sm:grid-cols-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="size-4 shrink-0 text-gold" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/signup" className={ctaButtonClass}>
            Demander une démonstration
          </Link>
        </div>
      </section>

      {/* Pourquoi choisir */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Pourquoi choisir notre plateforme ?</h2>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>Organiser un pèlerinage est une grande responsabilité.</p>
          <p>
            Chaque erreur peut avoir des conséquences importantes : un passeport oublié, un paiement non enregistré,
            un visa manquant ou une chambre mal attribuée.
          </p>
          <p>Notre plateforme a été conçue pour réduire ces risques grâce à une gestion entièrement centralisée.</p>
          <p className="font-medium text-foreground">
            Vous gardez le contrôle sur chaque voyage, chaque groupe et chaque pèlerin.
          </p>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="border-y border-border bg-secondary/30 dark:bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-semibold sm:text-3xl">
            Tout ce dont votre agence a besoin
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="flex flex-col gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="font-heading text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  {feature.itemsIntro && <p className="text-sm font-medium">{feature.itemsIntro}</p>}
                  <ul className="flex flex-col gap-1.5">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="size-3.5 shrink-0 text-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {feature.footnote && (
                    <p className="text-sm text-muted-foreground italic">{feature.footnote}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gain de temps */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Gagnez plusieurs heures chaque semaine</h2>
        <div className="mt-6 space-y-4 text-muted-foreground">
          <p>
            Avec notre logiciel, votre équipe passe moins de temps sur les tâches administratives et davantage sur
            l&apos;accompagnement de vos pèlerins.
          </p>
          <p>
            Vous réduisez les erreurs, améliorez votre organisation et offrez une expérience plus professionnelle à
            vos clients.
          </p>
        </div>
      </section>

      {/* Accessibilité */}
      <section className="border-y border-border bg-secondary/30 dark:bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Une plateforme accessible partout</h2>
          <p className="mt-4 text-muted-foreground">Travaillez depuis :</p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {DEVICES.map((device) => (
              <div key={device.label} className="flex flex-col items-center gap-2">
                <span className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <device.icon className="size-5" />
                </span>
                <span className="text-sm text-muted-foreground">{device.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-1 text-muted-foreground">
            <p>Aucune installation n&apos;est nécessaire.</p>
            <p>Une simple connexion Internet suffit.</p>
          </div>
        </div>
      </section>

      {/* Sécurité */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-heading text-2xl font-semibold sm:text-3xl">Vos données sont protégées</h2>
        <p className="mt-4 text-center text-muted-foreground">
          Nous accordons une importance particulière à la sécurité.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {SECURITY.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 rounded-lg bg-secondary/50 px-4 py-3 text-sm font-medium dark:bg-card"
            >
              <ShieldCheck className="size-4 shrink-0 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Témoignages */}
      <section className="border-y border-border bg-secondary/30 dark:bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-semibold sm:text-3xl">Ils nous font confiance</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <Card key={testimonial.role}>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="text-sm font-medium text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-heading text-2xl font-semibold sm:text-3xl">Questions fréquentes</h2>
        <div className="mt-8 flex flex-col divide-y divide-border rounded-xl ring-1 ring-foreground/10">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center sm:px-6">
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">Prêt à moderniser votre agence ?</h2>
          <p className="max-w-xl text-primary-foreground/80">
            Rejoignez les agences qui simplifient déjà la gestion de leurs pèlerinages grâce à une plateforme pensée
            spécialement pour leurs besoins.
          </p>
          <p className="max-w-xl text-primary-foreground/80">
            Réservez dès aujourd&apos;hui une démonstration gratuite et découvrez comment gagner du temps, réduire
            les erreurs et offrir un meilleur service à vos pèlerins.
          </p>
          <Link href="/signup" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-2 h-12 px-8 text-base")}>
            Demander une démonstration gratuite
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Oumra CRM. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
