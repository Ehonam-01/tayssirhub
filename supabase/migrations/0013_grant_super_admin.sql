-- Tayssir — attribution du rôle super admin à ehonam2000@gmail.com, précédée
-- d'un durcissement nécessaire de la policy d'auto-modification du profil.
-- À exécuter APRÈS 0001-0012, dans le SQL Editor Supabase.
-- Idempotent : peut être ré-exécuté sans erreur.

-- ============================================================================
-- 1. Durcissement — profiles_update_self (migration 0001) autorise un
--    utilisateur à modifier N'IMPORTE QUELLE colonne de SA PROPRE ligne, y
--    compris :
--      - agency_id  : permettrait de s'auto-affecter à une autre agence et
--        d'accéder à ses données (current_agency_id() lit cette colonne) ;
--      - role       : auto-promotion agent -> owner au sein de sa propre
--        agence ;
--      - is_super_admin : auto-promotion super admin plateforme.
--    Aucun flux applicatif actuel n'a besoin d'éditer ces trois colonnes
--    depuis le client (vérifié : aucun `.from("profiles").update(...)` dans
--    le code, tout passage par agency_id/role/is_super_admin se fait via
--    des fonctions security definer qui ne dépendent pas de ce GRANT) — seuls
--    full_name/avatar_url doivent rester éditables par l'utilisateur
--    lui-même (bouton "Mon profil", pas encore branché mais prévu).
-- ============================================================================

revoke update on profiles from authenticated;
grant update (full_name, avatar_url) on profiles to authenticated;

-- ============================================================================
-- 2. Attribution du rôle super admin par email.
-- ============================================================================

update profiles
set is_super_admin = true
where id = (select id from auth.users where email = 'ehonam2000@gmail.com');
