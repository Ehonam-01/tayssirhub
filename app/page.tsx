import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { TrustBar } from "@/components/marketing/TrustBar";
import { Problem } from "@/components/marketing/Problem";
import { Solution } from "@/components/marketing/Solution";
import { Features } from "@/components/marketing/Features";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { WhyTayssir } from "@/components/marketing/WhyTayssir";
import { DashboardShowcase } from "@/components/marketing/DashboardShowcase";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Pricing } from "@/components/marketing/Pricing";
import { FAQ } from "@/components/marketing/FAQ";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";

// À REMPLACER par le vrai domaine de production avant mise en ligne (affecte
// l'URL canonique et les balises Open Graph/Twitter Card).
const SITE_URL = "https://tayssir.app";

export const metadata: Metadata = {
  title: "Tayssir — La gestion du pèlerinage, simplifiée",
  description:
    "Tayssir centralise la gestion des pèlerins, réservations, paiements, documents et logistique pour les agences de Hajj, Oumra et voyages religieux.",
  openGraph: {
    title: "Tayssir — La gestion du pèlerinage, simplifiée",
    description:
      "Le logiciel tout-en-un pour gérer vos pèlerinages Hajj, Oumra et Ramadan en toute sérénité.",
    url: SITE_URL,
    siteName: "Tayssir",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tayssir — La gestion du pèlerinage, simplifiée",
    description:
      "Le logiciel tout-en-un pour gérer vos pèlerinages Hajj, Oumra et Ramadan en toute sérénité.",
  },
  alternates: { canonical: SITE_URL },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Tayssir",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Logiciel de gestion pour agences de Hajj, Oumra et voyages religieux : pèlerins, réservations, paiements, documents, comptabilité et portail pèlerin.",
  url: SITE_URL,
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "EUR",
  },
};

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <Problem />
        <Solution />
        <Features />
        <HowItWorks />
        <WhyTayssir />
        <DashboardShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
