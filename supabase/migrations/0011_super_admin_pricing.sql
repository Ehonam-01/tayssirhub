-- Tayssir — Super Admin (rôle plateforme, hors isolation multi-tenant) et
-- tarification pilotée en base (pricing_plans), consommée par la landing page.
-- À exécuter APRÈS 0001-0010, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Super Admin
-- ============================================================================

alter table profiles add column if not exists is_super_admin boolean not null default false;

-- Équivalent plateforme de current_agency_id()/current_pilgrim_id() : un
-- super admin n'est pas scopé à une agence (agency_id peut être null).
create or replace function is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((select p.is_super_admin from profiles p where p.id = auth.uid()), false);
$$;

grant execute on function is_super_admin() to authenticated;

-- ============================================================================
-- 2. Tarification (pricing_plans)
-- ============================================================================

create table if not exists pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_monthly numeric(12, 2),
  price_yearly numeric(12, 2),
  currency text not null default 'EUR',
  -- "Sur devis" (offre Entreprise) : ignore price_monthly/price_yearly côté UI.
  is_custom_pricing boolean not null default false,
  features jsonb not null default '[]'::jsonb,
  cta_label text not null default 'Demander une démonstration',
  is_popular boolean not null default false,
  has_free_trial boolean not null default false,
  trial_days integer,
  color text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pricing_plans_display_order_idx on pricing_plans (display_order);

drop trigger if exists set_updated_at on pricing_plans;
create trigger set_updated_at before update on pricing_plans
  for each row execute function set_updated_at();

alter table pricing_plans enable row level security;

-- Lecture publique des offres publiées : la landing page n'a pas de session
-- (visiteur anonyme), donc accordée à anon en plus de authenticated.
drop policy if exists "pricing_plans_public_read" on pricing_plans;
create policy "pricing_plans_public_read" on pricing_plans
  for select using (is_published = true);

-- Super admin : accès complet, y compris aux brouillons non publiés.
drop policy if exists "pricing_plans_admin_all" on pricing_plans;
create policy "pricing_plans_admin_all" on pricing_plans
  for all using (is_super_admin())
  with check (is_super_admin());

grant select on pricing_plans to anon, authenticated;
grant insert, update, delete on pricing_plans to authenticated;

-- ============================================================================
-- 3. Seed des 3 offres (idempotent via upsert sur slug)
-- ============================================================================

insert into pricing_plans
  (slug, name, description, price_monthly, price_yearly, currency, is_custom_pricing, features, cta_label, is_popular, has_free_trial, trial_days, display_order)
values
  (
    'essentiel',
    'Essentiel',
    'Pour les petites agences qui démarrent leur transition numérique.',
    49, 470, 'EUR', false,
    '["Gestion des pèlerins et des campagnes", "Suivi des paiements et reliquats", "Documents administratifs", "1 utilisateur inclus", "Support par email"]'::jsonb,
    'Demander une démonstration', false, true, 14, 1
  ),
  (
    'professionnel',
    'Professionnel',
    'Pour les agences qui gèrent plusieurs départs et plusieurs équipes.',
    99, 950, 'EUR', false,
    '["Tout Essentiel", "Chambres, vols et guides", "Comptabilité et rapports", "Portail pèlerin", "5 utilisateurs inclus", "Support prioritaire"]'::jsonb,
    'Demander une démonstration', true, true, 14, 2
  ),
  (
    'entreprise',
    'Entreprise',
    'Pour les réseaux d''agences avec des besoins sur mesure.',
    null, null, 'EUR', true,
    '["Tout Professionnel", "Multi-agences", "Utilisateurs illimités", "Accompagnement dédié", "Intégrations sur mesure"]'::jsonb,
    'Nous contacter', false, false, null, 3
  )
on conflict (slug) do nothing;
