-- Oumra CRM — module Documents (passeport, visa, photo, vaccins, billet,
-- contrat, pièces diverses), avec statut et stockage de fichiers.
-- À exécuter APRÈS 0001/0002/0003, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Types énumérés
-- ============================================================================

do $$ begin
  create type document_type as enum ('passeport', 'visa', 'photo', 'vaccins', 'billet', 'contrat', 'autre');
exception when duplicate_object then null; end $$;

do $$ begin
  -- 'expire' est stocké tel quel (fidèle au cahier des charges) mais n'a pas
  -- besoin d'être mis à jour manuellement à l'échéance : l'app affiche un
  -- badge "Expiré" dérivé de expiry_date même si status est encore 'valide'.
  create type document_status as enum ('en_attente', 'valide', 'expire', 'rejete');
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. Table documents
-- ============================================================================

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references agencies (id) on delete cascade,
  pilgrim_id uuid not null references pilgrims (id) on delete cascade,
  type document_type not null,
  status document_status not null default 'en_attente',
  file_path text not null,
  file_name text not null,
  file_size integer,
  mime_type text,
  expiry_date date,
  rejection_reason text,
  uploaded_by uuid references profiles (id) on delete set null,
  reviewed_by uuid references profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_agency_id_idx on documents (agency_id);
create index if not exists documents_pilgrim_id_idx on documents (pilgrim_id);
create index if not exists documents_status_idx on documents (agency_id, status);

drop trigger if exists set_updated_at on documents;
create trigger set_updated_at before update on documents
  for each row execute function set_updated_at();

-- ============================================================================
-- 3. RLS + GRANT
-- ============================================================================

alter table documents enable row level security;

drop policy if exists "documents_tenant_isolation" on documents;
create policy "documents_tenant_isolation" on documents
  for all using (agency_id = current_agency_id())
  with check (agency_id = current_agency_id());

-- Rappel Phases 1-2 : RLS filtre les lignes mais ne remplace pas le GRANT de base.
grant select, insert, update, delete on documents to authenticated;

-- ============================================================================
-- 4. Supabase Storage : bucket privé + policies
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'documents',
  'documents',
  false,
  10485760, -- 10 Mo
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Convention de chemin : {agency_id}/{pilgrim_id}/{uuid}-{filename}.
-- Le 1er segment du chemin doit correspondre à l'agence de l'utilisateur,
-- indépendamment de ce que le client prétend envoyer.
drop policy if exists "documents_storage_select" on storage.objects;
create policy "documents_storage_select" on storage.objects
  for select using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_agency_id()::text
  );

drop policy if exists "documents_storage_insert" on storage.objects;
create policy "documents_storage_insert" on storage.objects
  for insert with check (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_agency_id()::text
  );

drop policy if exists "documents_storage_delete" on storage.objects;
create policy "documents_storage_delete" on storage.objects
  for delete using (
    bucket_id = 'documents'
    and (storage.foldername(name))[1] = current_agency_id()::text
  );
