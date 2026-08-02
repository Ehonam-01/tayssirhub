# Tayssir

SaaS de gestion d'agence de Hajj, Oumra et voyages religieux — "Tayssir" (faciliter, simplifier) :
la gestion du pèlerinage, simplifiée.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase (Postgres + Auth + RLS)

## 1. Créer le projet Supabase

Aucune CLI Supabase n'est requise. Tout se fait depuis le dashboard :

1. Créez un compte / projet sur [supabase.com](https://supabase.com).
2. Dans **Project Settings > API**, copiez `Project URL` et la clé `anon public`.
3. Copiez `.env.local.example` vers `.env.local` et collez ces deux valeurs.
4. Dans **Authentication > Providers > Email**, désactivez temporairement **Confirm email**
   pendant le développement (à réactiver avant la mise en production) pour pouvoir tester les
   inscriptions sans boîte mail de confirmation.
5. Ouvrez **SQL Editor > New query**, collez le contenu de
   [`supabase/migrations/0001_init_schema.sql`](supabase/migrations/0001_init_schema.sql) et exécutez-le.
   Ce script crée le schéma (agences, profils, campagnes, pèlerins), active la Row Level Security
   (isolation stricte par agence) et met en place l'onboarding automatique. Il est idempotent :
   vous pouvez le ré-exécuter sans erreur.

## 2. Lancer l'application

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) : vous serez redirigé vers `/login`.

## 3. Premier compte

1. Allez sur `/signup`, créez un compte (nom, email, mot de passe).
2. Vous êtes redirigé vers `/onboarding` : donnez un nom à votre agence.
3. Vous accédez au tableau de bord. Créez une campagne, puis un pèlerin rattaché.

## Architecture

- **Multi-tenant** : schéma PostgreSQL partagé, isolation par Row Level Security. Chaque table
  métier porte un `agency_id`, et une fonction `current_agency_id()` (basée sur `profiles`) est
  utilisée dans toutes les policies. Voir `supabase/migrations/0001_init_schema.sql`.
- **Auth & routing** : `middleware.ts` + `lib/supabase/middleware.ts` rafraîchissent la session
  Supabase sur chaque requête et redirigent selon l'état (non connecté → `/login`, connecté sans
  agence → `/onboarding`, sinon accès au dashboard).
- **Formulaires** : Server Actions (`lib/actions/*`) avec validation Zod (`lib/validations/*`),
  pattern `useActionState` côté client — pas de librairie de formulaire supplémentaire.
- **Types base de données** : `lib/types/database.ts` est écrit à la main (pas de CLI Supabase
  disponible dans cet environnement pour `supabase gen types`). À resynchroniser manuellement si
  le schéma évolue.

## Modules livrés

Campagnes, pèlerins, paiements, documents, chambres, vols, guides, CRM, comptabilité, rapports
(export CSV/Excel/PDF), notifications, portail pèlerin (accès lecture seule par lien magique),
landing page publique et espace Super Admin (tarification).
