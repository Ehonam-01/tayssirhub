import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNotifications } from "@/lib/notifications";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// Le contrôle d'accès (agence présente ou non) doit toujours lire l'état
// courant : jamais de mise en cache statique de ce layout.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("agency_id, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.agency_id) redirect("/onboarding");

  const { data: agency } = await supabase
    .from("agencies")
    .select("name")
    .eq("id", profile.agency_id)
    .single();

  const notifications = await getNotifications(supabase);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar agencyName={agency?.name ?? "Mon agence"} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar fullName={profile.full_name} role={profile.role} notificationCount={notifications.length} />
        <main className="flex-1 overflow-y-auto bg-secondary/30 p-4 dark:bg-background md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
