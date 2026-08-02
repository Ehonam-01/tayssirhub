-- Oumra CRM — module Guides (encadrants, groupe de pèlerins).
-- À exécuter APRÈS 0001-0006, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Table guides
-- ============================================================================

-- Un guide est rattaché à l'agence (pas à une seule campagne) : c'est un
-- membre d'équipe récurrent qui peut encadrer des groupes sur plusieurs
-- voyages au fil du temps.
create table if not exists guides (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guides_agency_id_idx on guides (agency_id);

drop trigger if exists set_updated_at on guides;
create trigger set_updated_at before update on guides
  for each row execute function set_updated_at();

alter table guides enable row level security;

drop policy if exists "guides_tenant_isolation" on guides;
create policy "guides_tenant_isolation" on guides
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- Rappel Phases 1-5 : RLS filtre les lignes mais ne remplace pas le GRANT de base.
grant select, insert, update, delete on guides to authenticated;

-- ============================================================================
-- 2. Rattachement pèlerin -> guide
-- ============================================================================

-- Un pèlerin n'a besoin que d'un seul guide (contrairement aux chambres qui
-- pouvaient être multi-hôtel) : une simple colonne nullable suffit, même
-- pattern que pilgrims.campaign_id.
alter table pilgrims add column if not exists guide_id uuid references guides (id) on delete set null;

create index if not exists pilgrims_guide_id_idx on pilgrims (guide_id);
