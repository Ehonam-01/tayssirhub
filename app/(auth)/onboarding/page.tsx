"use client";

import { useActionState } from "react";
import { createAgency } from "@/lib/actions/agency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormMessage } from "@/components/forms/form-message";
import { FieldError } from "@/components/forms/field-error";

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(createAgency, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nommez votre agence</CardTitle>
        <CardDescription>
          Ce nom apparaîtra sur vos contrats, reçus et dans l&apos;espace de votre équipe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agencyName">Nom de l&apos;agence</Label>
            <Input
              id="agencyName"
              name="agencyName"
              placeholder="Ex. Al-Amîne Voyages"
              autoFocus
              required
            />
            <FieldError errors={state?.fieldErrors?.agencyName} />
          </div>
          <FormMessage state={state} />
          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Création..." : "Créer mon agence"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
