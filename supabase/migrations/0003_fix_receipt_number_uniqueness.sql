-- Fix : le n° de reçu (receipt_number) était unique GLOBALEMENT au lieu d'être
-- unique PAR AGENCE. Chaque agence redémarre sa numérotation à REC-000001
-- (agencies.receipt_sequence part de 0), donc deux agences différentes
-- entraient forcément en collision sur leur premier reçu.
-- À exécuter APRÈS 0002_payments.sql, dans le SQL Editor Supabase.
-- Idempotent.

alter table payments drop constraint if exists payments_receipt_number_key;

drop index if exists payments_agency_receipt_number_idx;
create unique index payments_agency_receipt_number_idx
  on payments (agency_id, receipt_number)
  where receipt_number is not null;
