-- Tayssir — bascule la tarification (pricing_plans) de l'euro au franc CFA
-- (XOF), le marché cible étant l'Afrique francophone.
-- À exécuter APRÈS 0001-0011, dans le SQL Editor Supabase.
-- Idempotent : ré-exécutable sans erreur (les valeurs sont posées explicitement,
-- pas incrémentées).
-- Ne modifie pas le seed de 0011 (déjà exécuté) — corrige les lignes existantes
-- par slug, même principe que 0003 après 0002.

update pricing_plans set currency = 'XOF', price_monthly = 30000, price_yearly = 288000
  where slug = 'essentiel';

update pricing_plans set currency = 'XOF', price_monthly = 60000, price_yearly = 576000
  where slug = 'professionnel';

update pricing_plans set currency = 'XOF'
  where slug = 'entreprise';
