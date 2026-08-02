import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/supabase/get-current-profile";
import { DocumentsTable } from "@/components/documents/documents-table";
import { UploadDocumentDialog } from "@/components/documents/upload-document-dialog";

export const dynamic = "force-dynamic";

export default async function DocumentsPage() {
  const supabase = await createClient();
  const [{ data: documents }, { data: pilgrims }, profile] = await Promise.all([
    supabase
      .from("documents")
      .select("*, pilgrims(first_name, last_name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("pilgrims")
      .select("id, first_name, last_name")
      .order("last_name", { ascending: true }),
    getCurrentProfile(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-xl font-semibold">Documents</h1>
          <p className="text-sm text-muted-foreground">
            Passeports, visas, photos, vaccins, billets, contrats de tous vos pèlerins.
          </p>
        </div>
        {profile?.agency_id && (
          <UploadDocumentDialog pilgrims={pilgrims ?? []} agencyId={profile.agency_id} />
        )}
      </div>

      <DocumentsTable documents={documents ?? []} />
    </div>
  );
}
