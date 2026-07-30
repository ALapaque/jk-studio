-- JKStudio — journal (blog). À exécuter après 0006. Idempotent. Non destructif.
--
-- Articles éditoriaux (mariages réels, coulisses…), pour le SEO local et la
-- preuve de travail récent. Corps en Markdown (rendu et assaini côté serveur).
-- Même modèle de visibilité que les séries : lecture publique UNIQUEMENT si
-- l'article est publié ; écriture réservée aux comptes authentifiés.

create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  -- Slug d'URL, unique : /journal/<slug>.
  slug         text not null unique,
  title        text not null,
  -- Chapô / méta-description (résumé court, réutilisé en OpenGraph).
  excerpt      text,
  -- Clé Storage de l'image de couverture (bucket portfolio), ou vide.
  cover_path   text,
  -- Corps en Markdown. Rendu en HTML assaini au rendu public.
  body         text not null default '',
  -- Étiquettes libres (lieu, type de prestation…), pour le regroupement.
  tags         text[] not null default '{}',
  published    boolean not null default false,
  -- Date d'édition affichée + tri du flux. Renseignée à la première
  -- publication, modifiable ensuite.
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (published, published_at desc);

-- ============================================================ RLS

alter table public.posts enable row level security;

-- Lecture publique : seulement les articles publiés (comme les séries).
drop policy if exists posts_read on public.posts;
create policy posts_read on public.posts for select using (published = true);

-- Écriture : comptes authentifiés uniquement.
drop policy if exists posts_manage on public.posts;
create policy posts_manage on public.posts for all to authenticated
  using (true) with check (true);
