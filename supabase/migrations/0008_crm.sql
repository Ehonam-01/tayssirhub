-- Oumra CRM — module CRM (pipeline commercial des prospects).
-- À exécuter APRÈS 0001-0007, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

do $$ begin
  create type crm_stage as enum (
    'prospect',
    'contacte',
    'relance',
    'inscrit',
    'paiement_recu',
    'voyage_termine'
  );
exception when duplicate_object then null; end $$;

-- Dimension séparée du statut de dossier (pilgrims.status) : le pipeline
-- commercial (a-t-on relancé ce prospect ?) et l'état administratif du
-- dossier (papiers complets ?) évoluent indépendamment l'un de l'autre.
alter table pilgrims add column if not exists crm_stage crm_stage not null default 'prospect';

create index if not exists pilgrims_crm_stage_idx on pilgrims (agency_id, crm_stage);
