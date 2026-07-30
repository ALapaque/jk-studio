-- JKStudio — template de mise en page des articles. À exécuter après 0009. Idempotent.
--
-- Chaque article du journal peut choisir parmi plusieurs variantes de mise en
-- page pour sa page détail (classique, magazine, minimal, galerie d'abord,
-- pleine page…). Le rendu public lit cette clé et charge le composant
-- correspondant depuis le registre `components/jk/post-templates`. Défaut
-- `classic` = la mise en page actuelle : l'existant reste identique.

alter table public.posts
  add column if not exists template text not null default 'classic';
