import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/marketing/fade-in";

// À REMPLACER : le brief demandait des témoignages de clients. Tayssir
// n'ayant pas encore de clients réels, en inventer attribués à de faux
// dirigeants d'agence serait trompeur pour les visiteurs (et s'apparente à
// de la publicité mensongère). En attendant de vrais retours, cette section
// assume honnêtement d'être une plateforme récente et invite les premières
// agences partenaires — remplacer ces 3 cartes par de vraies citations dès
// qu'elles existent.
const SLOTS = [
  "Une des premières agences à passer sur Tayssir",
  "Un retour d'expérience sur la mise en place",
  "Un avis sur le gain de temps au quotidien",
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/30 dark:bg-card/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Ils nous font confiance
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tayssir accompagne aujourd&apos;hui ses premières agences partenaires. Leurs retours
            trouveront naturellement leur place ici.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {SLOTS.map((slot, i) => (
            <FadeIn key={slot} delay={i * 0.08}>
              <Card className="h-full border-dashed">
                <CardContent className="flex h-full flex-col gap-3">
                  <Quote className="size-5 text-gold/60" />
                  <p className="text-sm text-muted-foreground italic">{slot}</p>
                  <p className="mt-auto text-xs font-medium text-muted-foreground/70">Bientôt disponible</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
