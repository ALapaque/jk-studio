-- JKStudio — galerie média des articles. À exécuter après 0007. Idempotent.
--
-- Un article peut porter une galerie d'images affichées dans la page détail
-- (au-delà des images insérées dans le corps Markdown). Stockée en JSONB sur la
-- ligne `posts` : un tableau ordonné d'objets « { path, caption } », où `path`
-- est une clé Storage (upload direct ou asset de la médiathèque, par référence).
-- Pas de table séparée : la galerie appartient à l'article, hérite de sa RLS
-- (lecture publique seulement si publié) et voyage avec lui.

alter table public.posts
  add column if not exists media jsonb not null default '[]'::jsonb;
