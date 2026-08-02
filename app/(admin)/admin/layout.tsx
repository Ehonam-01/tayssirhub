import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { buttonVariants } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.is_super_admin) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col bg-secondary/30 dark:bg-background">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
        <Link href="/admin/pricing" className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary font-heading text-sm font-semibold text-primary-foreground">
            T
          </span>
          <span className="text-sm font-semibold">Admin Tayssir</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/admin/pricing" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Tarifs
          </Link>
        </nav>
        <div className="flex-1" />
        <form action={logout}>
          <button type="submit" className="text-sm text-muted-foreground hover:text-foreground">
            Se déconnecter
          </button>
        </form>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  );
}
