-- JKStudio — template de mise en page des séries. À exécuter après 0008. Idempotent.
--
-- Chaque série peut choisir parmi plusieurs variantes de mise en page pour sa
-- page détail (défilé plein écran, planche contact, cinéma, colonnes, mur de
-- galerie…). Le rendu public lit cette clé et charge le composant correspondant
-- depuis le registre `components/jk/series-templates`. Défaut `classic` = la
-- mise en page actuelle : l'existant reste identique tant qu'on n'y touche pas.

alter table public.projects
  add column if not exists template text not null default 'classic';
