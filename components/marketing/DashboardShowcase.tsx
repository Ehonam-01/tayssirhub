import { Building2, Home, Smartphone, Tablet, Wallet, Users, CalendarClock, PiggyBank } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FadeIn } from "@/components/marketing/fade-in";

const DEVICES: { icon: LucideIcon; label: string }[] = [
  { icon: Building2, label: "Au bureau" },
  { icon: Home, label: "À la maison" },
  { icon: Smartphone, label: "Sur mobile" },
  { icon: Tablet, label: "Sur tablette" },
];

// Recréation simplifiée du vrai tableau de bord Tayssir (mêmes couleurs et
// composants que l'application), pas une capture inventée ni une photo de
// stock — cohérent avec l'absence de vraie image produit disponible ici.
function DashboardMock() {
  return (
    <div className="flex overflow-hidden rounded-xl bg-card">
      <div className="hidden w-14 shrink-0 flex-col items-center gap-3 bg-primary py-4 sm:flex">
        <span className="flex size-7 items-center justify-center rounded-lg bg-primary-foreground/10 text-xs font-semibold text-primary-foreground">
          T
        </span>
        {[Users, Wallet, CalendarClock, PiggyBank].map((Icon, i) => (
          <span
            key={i}
            className="flex size-7 items-center justify-center rounded-lg text-primary-foreground/60"
          >
            <Icon className="size-4" />
          </span>
        ))}
      </div>
      <div className="flex-1 p-4">
        <p className="text-xs text-muted-foreground">Bon retour 👋</p>
        <p className="font-heading text-sm font-semibold">Tableau de bord</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { icon: Users, label: "Pèlerins", value: "482" },
            { icon: Wallet, label: "Paiements", value: "128 400 €" },
            { icon: PiggyBank, label: "Bénéfice", value: "24 100 €" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-secondary/60 p-2.5 dark:bg-muted/40">
              <stat.icon className="size-3.5 text-gold" />
              <p className="mt-1.5 text-sm font-semibold">{stat.value}</p>
              <p className="text-[0.6rem] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {["Groupe Hajj — Août 2026", "Groupe Oumra — Ramadan 2026"].map((label) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-secondary/60 px-2.5 py-1.5 text-xs dark:bg-muted/40">
              <span className="font-medium">{label}</span>
              <span className="rounded-full bg-gold/15 px-1.5 py-0.5 text-[0.6rem] font-medium text-gold">Ouvert</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DashboardShowcase() {
  return (
    <section id="dashboard" className="border-b border-border bg-secondary/30 py-20 dark:bg-card/20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Une plateforme accessible partout
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Aucune installation nécessaire — une simple connexion Internet suffit, depuis
            n&apos;importe quel appareil.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="relative mx-auto mt-16 max-w-3xl pb-16 sm:pb-20">
          {/* Ordinateur */}
          <div className="rounded-t-xl border-[6px] border-b-0 border-foreground/85 bg-foreground/85 p-1.5 shadow-2xl shadow-primary/10">
            <DashboardMock />
          </div>
          <div className="mx-auto h-3 w-[112%] -translate-x-[calc(6%)] rounded-b-lg bg-foreground/70" />

          {/* Mobile, en incrustation */}
          <div className="absolute -bottom-4 right-2 hidden w-28 rounded-[1.4rem] border-4 border-foreground/85 bg-foreground/85 shadow-xl sm:block">
            <div className="overflow-hidden rounded-[1.1rem] bg-card">
              <div className="flex items-center justify-between bg-primary px-2 py-1.5">
                <span className="text-[0.55rem] font-semibold text-primary-foreground">Tayssir</span>
              </div>
              <div className="flex flex-col gap-1.5 p-2">
                <div className="rounded-md bg-secondary/60 p-1.5 dark:bg-muted/40">
                  <p className="text-[0.55rem] text-muted-foreground">Reliquat</p>
                  <p className="text-xs font-semibold">18 250 €</p>
                </div>
                <div className="rounded-md bg-secondary/60 p-1.5 dark:bg-muted/40">
                  <p className="text-[0.55rem] text-muted-foreground">Pèlerins</p>
                  <p className="text-xs font-semibold">482</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
          {DEVICES.map((device) => (
            <div key={device.label} className="flex flex-col items-center gap-2">
              <span className="flex size-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <device.icon className="size-4.5" />
              </span>
              <span className="text-xs text-muted-foreground">{device.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
