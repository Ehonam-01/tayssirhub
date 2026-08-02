"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function DocumentDownloadButton({ filePath }: { filePath: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(filePath, 60);
    setLoading(false);

    if (error || !data?.signedUrl) {
      toast.error("Impossible d'ouvrir le document.");
      return;
    }

    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      <Download /> {loading ? "..." : "Voir"}
    </Button>
  );
}
