-- Oumra CRM — module Paiements (échéancier + historique unifiés, reçus).
-- À exécuter APRÈS 0001_init_schema.sql, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Types énumérés
-- ============================================================================

do $$ begin
  create type payment_method as enum ('especes', 'mobile_money', 'virement', 'stripe', 'cheque');
exception when duplicate_object then null; end $$;

do $$ begin
  -- 'scheduled' = échéance planifiée non payée, 'paid' = encaissé, 'cancelled' = annulé.
  -- Pas d'état "overdue" stocké : une échéance en retard est dérivée à l'affichage
  -- (scheduled + due_date < aujourd'hui), pour ne jamais avoir un statut à resynchroniser.
  create type payment_status as enum ('scheduled', 'paid', 'cancelled');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. Colonnes ajoutées aux tables existantes
-- ============================================================================

alter table pilgrims add column if not exists package_price numeric(12, 2);
-- Prix du package pour ce pèlerin. Si null, l'app retombe sur campaigns.price.
-- Permet les surcoûts/remises individuels sans dupliquer toute la logique de pricing.

alter table agencies add column if not exists receipt_sequence integer not null default 0;
-- Compteur pour la numérotation séquentielle des reçus, par agence.

-- ============================================================================
-- 3. Table payments
-- ============================================================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  pilgrim_id uuid not null references pilgrims (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null,
  method payment_method,
  status payment_status not null default 'scheduled',
  due_date date,
  paid_at timestamptz,
  reference text,
  receipt_number text,
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_agency_id_idx on payments (agency_id);
create index if not exists payments_pilgrim_id_idx on payments (pilgrim_id);
create index if not exists payments_status_idx on payments (agency_id, status);

-- Unique PAR AGENCE (pas globalement) : chaque agence a sa propre numérotation
-- de reçus, qui redémarre à REC-000001.
create unique index if not exists payments_agency_receipt_number_idx
  on payments (agency_id, receipt_number)
  where receipt_number is not null;

drop trigger if exists set_updated_at on payments;
create trigger set_updated_at before update on payments
  for each row execute function set_updated_at();

-- ============================================================================
-- 4. Numérotation automatique des reçus
-- ============================================================================

create or replace function assign_receipt_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  seq integer;
begin
  if new.status = 'paid' and new.receipt_number is null then
    update agencies
    set receipt_sequence = receipt_sequence + 1
    where id = new.agency_id
    returning receipt_sequence into seq;

    new.receipt_number := 'REC-' || lpad(seq::text, 6, '0');

    if new.paid_at is null then
      new.paid_at := now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists set_receipt_number on payments;
create trigger set_receipt_number
  before insert or update on payments
  for each row execute function assign_receipt_number();

-- ============================================================================
-- 5. RLS
-- ============================================================================

alter table payments enable row level security;

drop policy if exists "payments_tenant_isolation" on payments;
create policy "payments_tenant_isolation" on payments
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- ============================================================================
-- 6. Privilèges (GRANT)
-- ============================================================================
-- Rappel Phase 1 : RLS filtre les lignes mais ne remplace pas le GRANT de base.

grant select, insert, update, delete on payments to authenticated;
