import { FadeIn } from "@/components/marketing/fade-in";

const FAQS = [
  {
    question: "Puis-je gérer plusieurs départs simultanément ?",
    answer: "Oui. Vous pouvez créer autant de campagnes (Hajj, Oumra, Ramadan, voyages sur mesure) que nécessaire, chacune avec son propre quota, ses pèlerins et son suivi financier.",
  },
  {
    question: "Les données de mon agence sont-elles sécurisées ?",
    answer: "Oui. Chaque agence est strictement isolée des autres au niveau de la base de données : personne en dehors de votre équipe ne peut voir vos pèlerins, paiements ou documents.",
  },
  {
    question: "Puis-je accéder à Tayssir depuis mon téléphone ?",
    answer: "Oui. La plateforme est entièrement responsive et fonctionne sur ordinateur, tablette et smartphone, sans application à installer.",
  },
  {
    question: "Une formation est-elle prévue au démarrage ?",
    answer: "Oui. Nous vous accompagnons dans la prise en main pour que votre équipe soit opérationnelle rapidement.",
  },
  {
    question: "Puis-je importer mes données depuis Excel ?",
    answer: "Nos équipes vous accompagnent pour reprendre vos pèlerins et campagnes existants au moment de votre mise en place.",
  },
  {
    question: "Combien d'utilisateurs puis-je ajouter à mon compte ?",
    answer: "Le nombre d'utilisateurs inclus dépend de votre offre — voir le détail dans la section tarifs ci-dessus.",
  },
  {
    question: "Puis-je essayer Tayssir avant de m'engager ?",
    answer: "Oui, un essai gratuit est proposé sur les offres Essentiel et Professionnel — sans carte bancaire requise.",
  },
  {
    question: "Comment sont gérés les paiements de mes pèlerins ?",
    answer: "Vous enregistrez les échéances et les paiements reçus dans Tayssir, qui calcule automatiquement le reliquat et génère les reçus.",
  },
  {
    question: "Puis-je suivre plusieurs devises ?",
    answer: "Oui. Chaque campagne a sa propre devise, et vos rapports financiers regroupent toujours les montants par devise, jamais mélangés.",
  },
  {
    question: "Mes pèlerins peuvent-ils suivre leur dossier eux-mêmes ?",
    answer: "Oui, via le portail pèlerin : un accès sécurisé, sans mot de passe, pour consulter leur dossier, leurs paiements et leurs documents.",
  },
  {
    question: "Puis-je exporter mes données ?",
    answer: "Oui. Tayssir propose des exports Excel, CSV et des rapports PDF pour vos pèlerins, paiements, campagnes et dépenses.",
  },
  {
    question: "Que se passe-t-il si j'arrête d'utiliser Tayssir ?",
    answer: "Vos données restent exportables à tout moment tant que votre compte est actif — vous n'êtes jamais enfermé dans la plateforme.",
  },
  {
    question: "Tayssir convient-il aux petites agences ?",
    answer: "Oui, l'offre Essentiel a été pensée pour les agences qui démarrent leur transition numérique, avec l'essentiel pour bien commencer.",
  },
  {
    question: "Puis-je gérer un réseau de plusieurs agences ?",
    answer: "L'offre Entreprise est conçue sur mesure pour ce besoin — contactez-nous pour en discuter.",
  },
  {
    question: "Comment vous contacter en cas de besoin ?",
    answer: "Depuis votre espace, ou en demandant une démonstration ci-dessous — notre équipe vous répond directement.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <FadeIn className="text-center">
        <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Questions fréquentes
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-10 flex flex-col divide-y divide-border rounded-2xl bg-card ring-1 ring-foreground/10">
        {FAQS.map((faq) => (
          <details key={faq.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
              {faq.question}
              <span className="shrink-0 text-lg text-muted-foreground transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
          </details>
        ))}
      </FadeIn>
    </section>
  );
}
