-- Oumra CRM — module Comptabilité (dépenses ; les recettes existent déjà
-- via payments.status='paid', la marge est calculée à la volée, jamais stockée).
-- À exécuter APRÈS 0001-0008, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

do $$ begin
  create type expense_category as enum (
    'hebergement', 'transport', 'vols', 'visas', 'guides', 'restauration', 'marketing', 'salaires', 'autre'
  );
exception when duplicate_object then null; end $$;

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  -- SET NULL (pas cascade) : une dépense reste dans la compta même si la
  -- campagne à laquelle elle était liée est supprimée.
  campaign_id uuid references campaigns (id) on delete set null,
  category expense_category not null default 'autre',
  label text not null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'XOF',
  expense_date date,
  notes text,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists expenses_agency_id_idx on expenses (agency_id);
create index if not exists expenses_campaign_id_idx on expenses (agency_id, campaign_id);

drop trigger if exists set_updated_at on expenses;
create trigger set_updated_at before update on expenses
  for each row execute function set_updated_at();

alter table expenses enable row level security;

drop policy if exists "expenses_tenant_isolation" on expenses;
create policy "expenses_tenant_isolation" on expenses
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- Rappel Phases 1-7 : RLS filtre les lignes mais ne remplace pas le GRANT de base.
grant select, insert, update, delete on expenses to authenticated;
