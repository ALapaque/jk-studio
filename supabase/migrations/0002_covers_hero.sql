-- JKStudio — évolution : couvertures uploadables + photos « à la une » (hero)
-- À exécuter dans Supabase → SQL Editor, après 0001_init.sql. Idempotent.

-- Image de couverture propre à une catégorie (clé Storage ou URL).
alter table public.categories add column if not exists cover_path text;

-- Mise en avant d'une photo dans le hero de l'accueil.
alter table public.photos add column if not exists featured boolean not null default false;
alter table public.photos add column if not exists featured_position int not null default 0;

create index if not exists photos_featured_idx
  on public.photos (featured_position)
  where featured;
