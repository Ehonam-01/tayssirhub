-- Oumra CRM — schéma initial (fondations multi-tenant, campagnes, pèlerins)
-- À exécuter dans le SQL Editor du projet Supabase (Dashboard > SQL Editor > New query).
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Types énumérés
-- ============================================================================

do $$ begin
  create type agency_plan as enum ('starter', 'pro', 'business', 'enterprise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type user_role as enum ('owner', 'admin', 'agent');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_type as enum ('hajj', 'omra', 'ramadan', 'autre');
exception when duplicate_object then null; end $$;

do $$ begin
  create type campaign_status as enum ('draft', 'open', 'full', 'closed', 'completed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pilgrim_status as enum (
    'prospect', 'inscrit', 'dossier_incomplet', 'dossier_complet',
    'confirme', 'parti', 'revenu', 'annule'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type pilgrim_gender as enum ('homme', 'femme');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. Tables
-- ============================================================================

create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan agency_plan not null default 'starter',
  logo_url text,
  phone text,
  address text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Étend auth.users : chaque utilisateur Supabase a un profil applicatif.
-- agency_id est nullable tant que l'utilisateur n'a pas terminé l'onboarding.
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  agency_id uuid references agencies (id) on delete cascade,
  role user_role not null default 'agent',
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create index if not exists profiles_agency_id_idx on profiles (agency_id);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  name text not null,
  type campaign_type not null,
  status campaign_status not null default 'draft',
  start_date date,
  end_date date,
  price numeric(12, 2),
  currency text not null default 'XOF',
  quota integer,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists campaigns_agency_id_idx on campaigns (agency_id);
create index if not exists campaigns_status_idx on campaigns (agency_id, status);

create table if not exists pilgrims (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  campaign_id uuid references campaigns (id) on delete set null,
  first_name text not null,
  last_name text not null,
  gender pilgrim_gender,
  birth_date date,
  nationality text,
  profession text,
  address text,
  phone text,
  email text,
  emergency_contact_name text,
  emergency_contact_phone text,
  photo_url text,
  status pilgrim_status not null default 'prospect',
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pilgrims_agency_id_idx on pilgrims (agency_id);
create index if not exists pilgrims_campaign_id_idx on pilgrims (campaign_id);
create index if not exists pilgrims_status_idx on pilgrims (agency_id, status);

-- ============================================================================
-- 3. updated_at automatique
-- ============================================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on agencies;
create trigger set_updated_at before update on agencies
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on campaigns;
create trigger set_updated_at before update on campaigns
  for each row execute function set_updated_at();

drop trigger if exists set_updated_at on pilgrims;
create trigger set_updated_at before update on pilgrims
  for each row execute function set_updated_at();

-- ============================================================================
-- 4. Isolation multi-tenant (Row Level Security)
-- ============================================================================

-- Fonction centrale : renvoie l'agency_id du profil de l'utilisateur courant.
-- security definer + search_path figé pour éviter tout hijack de search_path.
create or replace function current_agency_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select agency_id from profiles where id = auth.uid();
$$;

alter table agencies enable row level security;
alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table pilgrims enable row level security;

drop policy if exists "agencies_select_own" on agencies;
create policy "agencies_select_own" on agencies
  for select using (id = current_agency_id());

drop policy if exists "agencies_update_own" on agencies;
create policy "agencies_update_own" on agencies
  for update using (id = current_agency_id())
  with check (id = current_agency_id());

drop policy if exists "profiles_select_same_agency" on profiles;
create policy "profiles_select_same_agency" on profiles
  for select using (
    id = auth.uid() or agency_id = current_agency_id()
  );

drop policy if exists "profiles_update_self" on profiles;
create policy "profiles_update_self" on profiles
  for update using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "campaigns_tenant_isolation" on campaigns;
create policy "campaigns_tenant_isolation" on campaigns
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

drop policy if exists "pilgrims_tenant_isolation" on pilgrims;
create policy "pilgrims_tenant_isolation" on pilgrims
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- ============================================================================
-- 5. Onboarding : création automatique du profil + création d'agence
-- ============================================================================

-- Un nouvel utilisateur Supabase Auth obtient immédiatement une ligne profiles
-- (agency_id null tant qu'il n'a pas créé/rejoint une agence).
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Crée l'agence pour l'utilisateur courant et le nomme owner.
-- Échoue si l'utilisateur appartient déjà à une agence (empêche un second tenant
-- accidentel) ou si le slug est déjà pris.
create or replace function create_agency_with_owner(agency_name text, agency_slug text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_agency_id uuid;
  existing_agency_id uuid;
begin
  select agency_id into existing_agency_id from profiles where id = auth.uid();

  if existing_agency_id is not null then
    raise exception 'user_already_has_agency';
  end if;

  insert into agencies (name, slug)
  values (agency_name, agency_slug)
  returning id into new_agency_id;

  update profiles
  set agency_id = new_agency_id, role = 'owner'
  where id = auth.uid();

  return new_agency_id;
end;
$$;

-- ============================================================================
-- 6. Privilèges (GRANT)
-- ============================================================================
-- RLS filtre les LIGNES, mais Postgres exige en plus un GRANT au niveau TABLE
-- pour que le rôle "authenticated" (utilisé par tous les appels authentifiés
-- via PostgREST/Supabase) ait seulement le droit de lire/écrire ces tables.
-- Sans ces GRANT, toute requête authentifiée échoue silencieusement avec
-- "permission denied" (l'app le lit comme "aucune donnée").

grant usage on schema public to authenticated;

grant select, insert, update, delete
  on agencies, profiles, campaigns, pilgrims
  to authenticated;

grant execute on function current_agency_id() to authenticated;
grant execute on function create_agency_with_owner(text, text) to authenticated;
