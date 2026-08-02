"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Users, Wallet, CalendarCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GeometricPattern } from "@/components/marketing/geometric-pattern";
import { cn } from "@/lib/utils";

// Pas de photo de la Kaaba/Mecque disponible dans cet environnement : le clin
// d'œil spirituel passe par un dégradé doré (lumière du Haram au crépuscule)
// + motif géométrique islamique, plutôt qu'une photo générique de banque
// d'images. Le mockup ci-dessous est une vraie recréation simplifiée du
// dashboard Tayssir (mêmes couleurs/composants que l'app), pas une capture
// inventée.
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary/40 dark:bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-10%] right-[-10%] size-[38rem] rounded-full bg-gold/25 blur-3xl dark:bg-gold/15" />
        <GeometricPattern className="absolute inset-0 size-full text-primary/[0.04] dark:text-gold/[0.06]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-6"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground ring-1 ring-gold/30">
            <Sparkles className="size-3.5" />
            Conçu pour les agences de Hajj &amp; Oumra
          </span>

          <h1 className="font-heading text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            Gérez vos pèlerinages en toute simplicité.
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Tayssir centralise vos réservations, vos pèlerins, vos paiements et vos documents dans
            un seul tableau de bord — pour que votre équipe passe moins de temps sur l&apos;administratif
            et plus de temps auprès de vos voyageurs.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-12 px-7 text-base")}>
              Demander une démonstration
            </Link>
            <a
              href="#dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-7 text-base")}
            >
              Voir la plateforme
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl bg-card shadow-2xl shadow-primary/10 ring-1 ring-foreground/10">
            <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/40" />
              <span className="size-2.5 rounded-full bg-gold/50" />
              <span className="size-2.5 rounded-full bg-emerald-500/40" />
            </div>
            <div className="flex flex-col gap-3 p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Users, label: "Pèlerins", value: "482" },
                  { icon: CalendarCheck, label: "Départs actifs", value: "6" },
                  { icon: Wallet, label: "Paiements reçus", value: "128 400 €" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-secondary/60 p-3 dark:bg-muted/40">
                    <stat.icon className="size-4 text-gold" />
                    <p className="mt-2 text-lg font-semibold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 rounded-xl bg-secondary/60 p-3 dark:bg-muted/40">
                {["Groupe Hajj — Août 2026", "Groupe Oumra — Ramadan 2026", "Groupe Oumra — Décembre 2026"].map(
                  (label, i) => (
                    <div key={label} className="flex items-center justify-between rounded-lg bg-card px-3 py-2 text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                        {i === 0 ? "Complet" : "Ouvert"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -left-6 hidden w-44 rounded-xl bg-card p-3 shadow-xl ring-1 ring-foreground/10 sm:block">
            <p className="text-xs text-muted-foreground">Reliquat à recevoir</p>
            <p className="font-heading text-xl font-semibold text-gold">18 250 €</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
