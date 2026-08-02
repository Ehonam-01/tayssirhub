"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/lib/actions/auth";
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

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer votre agence</CardTitle>
        <CardDescription>
          Un compte, une agence. Vous pourrez inviter votre équipe ensuite.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" name="fullName" autoComplete="name" required />
            <FieldError errors={state?.fieldErrors?.fullName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            <FieldError errors={state?.fieldErrors?.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
            <FieldError errors={state?.fieldErrors?.password} />
          </div>
          <FormMessage state={state} />
          <Button type="submit" disabled={pending} className="mt-2 w-full">
            {pending ? "Création..." : "Créer mon compte"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
