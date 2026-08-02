import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GuideForm } from "@/components/guides/guide-form";
import { createGuide } from "@/lib/actions/guides";

export default function NewGuidePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-xl font-semibold">Nouveau guide</h1>
        <p className="text-sm text-muted-foreground">Ajoutez un encadrant à votre équipe.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Informations</CardTitle>
          <CardDescription>Vous pourrez modifier ces informations à tout moment.</CardDescription>
        </CardHeader>
        <CardContent>
          <GuideForm action={createGuide} submitLabel="Créer le guide" />
        </CardContent>
      </Card>
    </div>
  );
}
