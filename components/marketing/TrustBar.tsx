import { ShieldCheck, RefreshCw, Smartphone, Languages } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// À REMPLACER : le brief demandait des statistiques d'usage ("+X pèlerins
// gérés", "X agences"...). Tayssir n'a pas encore de clients réels — les
// afficher inventés serait trompeur pour les visiteurs. En attendant de
// vraies données, cette barre met en avant des caractéristiques produit
// vérifiables (isolation des données, sauvegardes, multi-appareil), pas des
// métriques d'usage fabriquées. Remplacer par de vraies statistiques dès
// qu'elles existent.
const ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: ShieldCheck, label: "Isolation stricte des données par agence" },
  { icon: RefreshCw, label: "Sauvegardes automatiques" },
  { icon: Smartphone, label: "Accessible sur tous les appareils" },
  { icon: Languages, label: "Pensé pour les agences francophones" },
];

export function TrustBar() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <item.icon className="size-4.5" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
