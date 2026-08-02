import { Users, CalendarRange, Wallet, FileText, BedDouble, Landmark, FileSpreadsheet, KeyRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/marketing/fade-in";

interface Flagship {
  icon: LucideIcon;
  title: string;
  description: string;
  points: string[];
}

const FLAGSHIP: Flagship[] = [
  {
    icon: Users,
    title: "Gestion des pèlerins",
    description: "Un dossier complet, à jour, accessible à toute l'équipe.",
    points: ["Informations personnelles", "Passeport & contacts d'urgence", "Historique du voyage"],
  },
  {
    icon: CalendarRange,
    title: "Réservations & campagnes",
    description: "Créez vos départs Hajj, Oumra ou Ramadan en quelques clics.",
    points: ["Quotas suivis en temps réel", "Statuts de dossier clairs", "Multi-campagnes"],
  },
  {
    icon: Wallet,
    title: "Paiements",
    description: "Ne perdez plus jamais le fil d'un versement.",
    points: ["Échéances & reliquats automatiques", "Reçus PDF générés", "Historique complet"],
  },
  {
    icon: FileText,
    title: "Documents administratifs",
    description: "Passeports, visas, billets — centralisés et à jour.",
    points: ["Statut en un coup d'œil", "Alerte avant expiration", "Disponible en quelques clics"],
  },
  {
    icon: BedDouble,
    title: "Logistique de groupe",
    description: "Hôtels, chambres, vols et guides, sans feuille de calcul.",
    points: ["Répartition des chambres", "Suivi des vols", "Guides assignés par groupe"],
  },
  {
    icon: Landmark,
    title: "Comptabilité",
    description: "Recettes, dépenses et marge, par campagne et en temps réel.",
    points: ["Marge calculée automatiquement", "Dépenses par catégorie", "Vue par devise"],
  },
  {
    icon: FileSpreadsheet,
    title: "Rapports en un clic",
    description: "Exportez ce dont vous avez besoin, quand vous en avez besoin.",
    points: ["Export Excel & CSV", "Rapport comptable PDF", "Aucune donnée codée en dur"],
  },
  {
    icon: KeyRound,
    title: "Portail pèlerin",
    description: "Un accès sécurisé pour que vos voyageurs suivent leur dossier.",
    points: ["Connexion sans mot de passe", "Lecture seule, données protégées", "Moins d'appels entrants"],
  },
];

// Le brief d'origine listait ~30 fonctionnalités ; un mur de 30 cases à
// cocher lit comme un tableau Excel, pas comme un SaaS premium. Les 8
// fonctionnalités phares ci-dessus sont présentées en détail ; les autres
// apparaissent en tags compacts ci-dessous — et uniquement celles réellement
// construites dans Tayssir (pas de SMS, QR code ou multi-agence : pas encore
// développés, les mentionner ici serait une fausse promesse).
const MORE_TAGS = [
  "Visas & passeports",
  "Guides",
  "Vols",
  "Hôtels",
  "Historique complet",
  "Statistiques en temps réel",
  "Notifications",
  "Tableau de bord",
  "CRM & suivi commercial",
  "Gestion des dépenses",
];

export function Features() {
  return (
    <section id="fonctionnalites" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <FadeIn className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Tout ce dont votre agence a besoin
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Chaque module a été pensé pour une agence de pèlerinage réelle — pas adapté d&apos;un CRM générique.
        </p>
      </FadeIn>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FLAGSHIP.map((feature, i) => (
          <FadeIn key={feature.title} delay={(i % 4) * 0.05}>
            <Card className="h-full transition-shadow hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="flex h-full flex-col gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="font-heading text-base font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <ul className="mt-auto flex flex-col gap-1.5 pt-2">
                  {feature.points.map((point) => (
                    <li key={point} className="text-xs text-muted-foreground">
                      · {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.1} className="mt-10 flex flex-wrap justify-center gap-2">
        {MORE_TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground dark:bg-muted"
          >
            {tag}
          </span>
        ))}
      </FadeIn>
    </section>
  );
}
