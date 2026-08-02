-- Oumra CRM — module Vols (aller/retour/interne par campagne).
-- À exécuter APRÈS 0001-0005, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Types énumérés
-- ============================================================================

do $$ begin
  create type flight_direction as enum ('aller', 'retour', 'interne');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. Table flights
-- ============================================================================

-- Un vol appartient à une campagne (pas d'affectation pèlerin-par-vol : tous
-- les pèlerins d'une campagne voyagent sur le même jeu de vols).
create table if not exists flights (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  campaign_id uuid not null references campaigns (id) on delete cascade,
  direction flight_direction not null default 'aller',
  airline text,
  flight_number text,
  departure_airport text,
  arrival_airport text,
  departure_at timestamptz,
  arrival_at timestamptz,
  layovers text,
  baggage_allowance text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists flights_agency_id_idx on flights (agency_id);
create index if not exists flights_campaign_id_idx on flights (campaign_id);

drop trigger if exists set_updated_at on flights;
create trigger set_updated_at before update on flights
  for each row execute function set_updated_at();

-- ============================================================================
-- 3. RLS + GRANT
-- ============================================================================

alter table flights enable row level security;

drop policy if exists "flights_tenant_isolation" on flights;
create policy "flights_tenant_isolation" on flights
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- Rappel Phases 1-4 : RLS filtre les lignes mais ne remplace pas le GRANT de base.
grant select, insert, update, delete on flights to authenticated;
