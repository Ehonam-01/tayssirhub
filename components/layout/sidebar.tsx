import Link from "next/link";
import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar({ agencyName }: { agencyName: string }) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary font-heading text-sm font-semibold text-sidebar-primary-foreground">
            O
          </span>
          <span className="truncate text-sm font-semibold">{agencyName}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <SidebarNav />
      </div>
    </aside>
  );
}
