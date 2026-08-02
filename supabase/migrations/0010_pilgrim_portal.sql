-- Oumra CRM — module Portail pèlerin.
-- Introduit un second type d'identité authentifiée (le pèlerin lui-même, via
-- lien magique Supabase Auth) en plus du staff d'agence. Toutes les policies
-- RLS ajoutées ici sont additives : elles ne touchent jamais aux policies
-- staff existantes (agency_id = current_agency_id()), elles ajoutent un accès
-- en lecture seule strictement limité aux données du pèlerin connecté.
-- À exécuter APRÈS 0001-0009, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur si certains objets existent déjà.

-- ============================================================================
-- 1. Table de liaison pèlerin ↔ compte Supabase Auth
-- ============================================================================

create table if not exists pilgrim_portal_access (
  pilgrim_id uuid primary key references pilgrims (id) on delete cascade,
  -- null tant que le pèlerin n'a pas réclamé son invitation.
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  invite_token uuid not null default gen_random_uuid(),
  invited_at timestamptz not null default now(),
  invited_by uuid references profiles (id) on delete set null,
  claimed_at timestamptz
);

create index if not exists pilgrim_portal_access_auth_user_id_idx
  on pilgrim_portal_access (auth_user_id);

-- ============================================================================
-- 2. Fonctions (security definer, même pattern que current_agency_id() /
--    create_agency_with_owner() de la migration 0001)
-- ============================================================================

-- Équivalent pèlerin de current_agency_id() : résout l'identité du pèlerin
-- connecté, utilisé par toutes les policies RLS ci-dessous.
create or replace function current_pilgrim_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select pilgrim_id from pilgrim_portal_access where auth_user_id = auth.uid();
$$;

-- Seule fonction accordée au rôle anon (appelée avant connexion, depuis la
-- page publique /portal/invite/[token]). Renvoie le prénom (affichage) et
-- l'email réel du pèlerin (nécessaire pour déclencher signInWithOtp côté
-- client) — connaître le token suffit déjà à connaître ce couple, aucune
-- fuite supplémentaire : sans le token, cette fonction ne renvoie rien.
create or replace function get_portal_invite_pilgrim_name(p_token uuid)
returns table (first_name text, email text)
language sql
stable
security definer
set search_path = public
as $$
  select p.first_name, p.email
  from pilgrim_portal_access ppa
  join pilgrims p on p.id = ppa.pilgrim_id
  where ppa.invite_token = p_token
    and ppa.auth_user_id is null;
$$;

-- Appelée juste après un verifyOtp réussi (le pèlerin a désormais une session
-- Supabase valide). Lie ce compte au pèlerin visé par le token. Idempotente
-- pour le même compte (reconnexion via le même lien avant expiration),
-- refuse si le token est déjà lié à un AUTRE compte.
create or replace function claim_pilgrim_portal_access(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pilgrim_id uuid;
  v_existing_auth_user_id uuid;
begin
  select pilgrim_id, auth_user_id into v_pilgrim_id, v_existing_auth_user_id
  from pilgrim_portal_access
  where invite_token = p_token;

  if v_pilgrim_id is null then
    raise exception 'invalid_invite_token';
  end if;

  if v_existing_auth_user_id is not null and v_existing_auth_user_id <> auth.uid() then
    raise exception 'invite_already_claimed';
  end if;

  update pilgrim_portal_access
  set auth_user_id = auth.uid(), claimed_at = coalesce(claimed_at, now())
  where invite_token = p_token;

  return v_pilgrim_id;
end;
$$;

-- ============================================================================
-- 3. RLS — pilgrim_portal_access elle-même
-- ============================================================================

alter table pilgrim_portal_access enable row level security;

-- Staff : peut créer/consulter les invitations des pèlerins de sa propre
-- agence (jamais celles d'une autre agence, ni écrire auth_user_id/claimed_at
-- — ces colonnes ne sont modifiées que par claim_pilgrim_portal_access, en
-- security definer, donc hors de portée d'une policy client normale).
drop policy if exists "pilgrim_portal_access_staff_read" on pilgrim_portal_access;
create policy "pilgrim_portal_access_staff_read" on pilgrim_portal_access
  for select using (
    pilgrim_id in (select id from pilgrims where agency_id = current_agency_id())
  );

drop policy if exists "pilgrim_portal_access_staff_write" on pilgrim_portal_access;
create policy "pilgrim_portal_access_staff_write" on pilgrim_portal_access
  for insert with check (
    pilgrim_id in (select id from pilgrims where agency_id = current_agency_id())
  );

drop policy if exists "pilgrim_portal_access_staff_update" on pilgrim_portal_access;
create policy "pilgrim_portal_access_staff_update" on pilgrim_portal_access
  for update using (
    pilgrim_id in (select id from pilgrims where agency_id = current_agency_id())
  )
  with check (
    pilgrim_id in (select id from pilgrims where agency_id = current_agency_id())
  );

-- Pèlerin du portail : peut lire sa propre ligne de liaison (borné à 1 ligne
-- par la contrainte unique sur auth_user_id) — utilisé par l'app pour
-- résoudre "qui suis-je" sans ambiguïté, y compris si un membre du staff
-- ouvre /portal par erreur (la requête reste bornée, jamais toutes les lignes
-- de l'agence).
drop policy if exists "pilgrim_portal_access_self_read" on pilgrim_portal_access;
create policy "pilgrim_portal_access_self_read" on pilgrim_portal_access
  for select using (auth_user_id = auth.uid());

-- ============================================================================
-- 4. RLS additive — accès en lecture seule du pèlerin à ses propres données
-- ============================================================================

drop policy if exists "pilgrims_portal_self_read" on pilgrims;
create policy "pilgrims_portal_self_read" on pilgrims
  for select using (id = current_pilgrim_id());

drop policy if exists "payments_portal_self_read" on payments;
create policy "payments_portal_self_read" on payments
  for select using (pilgrim_id = current_pilgrim_id());

drop policy if exists "documents_portal_self_read" on documents;
create policy "documents_portal_self_read" on documents
  for select using (pilgrim_id = current_pilgrim_id());

drop policy if exists "campaigns_portal_self_read" on campaigns;
create policy "campaigns_portal_self_read" on campaigns
  for select using (
    id = (select campaign_id from pilgrims where id = current_pilgrim_id())
  );

drop policy if exists "flights_portal_self_read" on flights;
create policy "flights_portal_self_read" on flights
  for select using (
    campaign_id = (select campaign_id from pilgrims where id = current_pilgrim_id())
  );

drop policy if exists "guides_portal_self_read" on guides;
create policy "guides_portal_self_read" on guides
  for select using (
    id = (select guide_id from pilgrims where id = current_pilgrim_id())
  );

drop policy if exists "hotels_portal_self_read" on hotels;
create policy "hotels_portal_self_read" on hotels
  for select using (
    campaign_id = (select campaign_id from pilgrims where id = current_pilgrim_id())
  );

drop policy if exists "rooms_portal_self_read" on rooms;
create policy "rooms_portal_self_read" on rooms
  for select using (
    hotel_id in (select hotel_id from room_assignments where pilgrim_id = current_pilgrim_id())
  );

drop policy if exists "room_assignments_portal_self_read" on room_assignments;
create policy "room_assignments_portal_self_read" on room_assignments
  for select using (pilgrim_id = current_pilgrim_id());

-- expenses : aucune policy portail ajoutée, volontairement — données
-- financières internes à l'agence, jamais exposées au pèlerin.

-- ============================================================================
-- 5. Privilèges (GRANT)
-- ============================================================================
-- Les GRANT select existants (migrations précédentes) couvrent déjà le rôle
-- authenticated sur pilgrims/payments/documents/campaigns/flights/guides/
-- hotels/rooms/room_assignments — un pèlerin du portail authentifié en
-- bénéficie déjà : seule la RLS ci-dessus restreint réellement les lignes.

grant select, insert, update on pilgrim_portal_access to authenticated;

grant execute on function current_pilgrim_id() to authenticated;
grant execute on function claim_pilgrim_portal_access(uuid) to authenticated;
grant execute on function get_portal_invite_pilgrim_name(uuid) to anon, authenticated;
