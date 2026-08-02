-- Oumra CRM — module Chambres (hôtels, chambres, affectations des pèlerins).
-- À exécuter APRÈS 0001/0002/0003/0004, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Types énumérés
-- ============================================================================

do $$ begin
  create type room_type as enum ('individuelle', 'double', 'triple', 'quadruple', 'quintuple', 'autre');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. Tables
-- ============================================================================

-- Un hôtel appartient à une campagne (une campagne implique souvent plusieurs
-- hôtels : La Mecque, Médine, parfois Jeddah).
create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  campaign_id uuid not null references campaigns (id) on delete cascade,
  name text not null,
  city text,
  address text,
  stars integer check (stars between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists hotels_agency_id_idx on hotels (agency_id);
create index if not exists hotels_campaign_id_idx on hotels (campaign_id);

drop trigger if exists set_updated_at on hotels;
create trigger set_updated_at before update on hotels
  for each row execute function set_updated_at();

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  hotel_id uuid not null references hotels (id) on delete cascade,
  number text not null,
  floor text,
  type room_type not null default 'quadruple',
  capacity integer not null check (capacity > 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rooms_agency_id_idx on rooms (agency_id);
create index if not exists rooms_hotel_id_idx on rooms (hotel_id);

drop trigger if exists set_updated_at on rooms;
create trigger set_updated_at before update on rooms
  for each row execute function set_updated_at();

-- hotel_id est dénormalisé depuis rooms.hotel_id : permet la contrainte
-- "un pèlerin = une seule chambre par hôtel" directement en base, et évite
-- un join sur rooms pour les requêtes d'occupation par hôtel.
create table if not exists room_assignments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  room_id uuid not null references rooms (id) on delete cascade,
  hotel_id uuid not null references hotels (id) on delete cascade,
  pilgrim_id uuid not null references pilgrims (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (hotel_id, pilgrim_id)
);

create index if not exists room_assignments_agency_id_idx on room_assignments (agency_id);
create index if not exists room_assignments_room_id_idx on room_assignments (room_id);
create index if not exists room_assignments_pilgrim_id_idx on room_assignments (pilgrim_id);

-- ============================================================================
-- 3. RLS + GRANT
-- ============================================================================

alter table hotels enable row level security;
alter table rooms enable row level security;
alter table room_assignments enable row level security;

drop policy if exists "hotels_tenant_isolation" on hotels;
create policy "hotels_tenant_isolation" on hotels
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

drop policy if exists "rooms_tenant_isolation" on rooms;
create policy "rooms_tenant_isolation" on rooms
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

drop policy if exists "room_assignments_tenant_isolation" on room_assignments;
create policy "room_assignments_tenant_isolation" on room_assignments
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- Rappel Phases 1-3 : RLS filtre les lignes mais ne remplace pas le GRANT de base.
grant select, insert, update, delete on hotels to authenticated;
grant select, insert, update, delete on rooms to authenticated;
grant select, insert, update, delete on room_assignments to authenticated;
