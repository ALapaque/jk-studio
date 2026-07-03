-- JKStudio — schéma initial (Phase 2)
-- À exécuter dans Supabase → SQL Editor (ou via la CLI supabase).
-- Idempotent autant que possible (IF NOT EXISTS / ON CONFLICT).

-- ============================================================ TABLES

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  subtitle    text,
  description text not null default '',
  location    text not null default '',
  period      text not null default '',
  position    int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete cascade,
  slug        text not null,
  title       text not null,
  description text not null default '',
  location    text not null default '',
  period      text not null default '',
  cover_path  text,
  position    int  not null default 0,
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (category_id, slug)
);

create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,          -- clé Storage, ou URL absolue (démo)
  alt          text,
  caption      text,
  width        int,
  height       int,
  position     int not null default 0,
  created_at   timestamptz not null default now()
);

create table if not exists public.videos (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  provider    text not null check (provider in ('youtube','vimeo')),
  video_id    text not null,
  title       text,
  position    int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.messages (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  project_type text,
  body         text not null,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);

create table if not exists public.site_content (
  key   text primary key,
  value jsonb not null default '{}'::jsonb
);

create index if not exists projects_category_idx on public.projects(category_id);
create index if not exists photos_project_idx    on public.photos(project_id);
create index if not exists videos_project_idx    on public.videos(project_id);
create index if not exists projects_published_idx on public.projects(published);

-- ============================================================ RLS

alter table public.categories   enable row level security;
alter table public.projects     enable row level security;
alter table public.photos       enable row level security;
alter table public.videos       enable row level security;
alter table public.messages     enable row level security;
alter table public.site_content enable row level security;

-- Catégories : lecture publique, écriture authentifiée.
drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select using (true);
drop policy if exists categories_manage on public.categories;
create policy categories_manage on public.categories for all to authenticated
  using (true) with check (true);

-- Projets (séries) : lecture publique si publié, écriture authentifiée.
drop policy if exists projects_read on public.projects;
create policy projects_read on public.projects for select using (published = true);
drop policy if exists projects_manage on public.projects;
create policy projects_manage on public.projects for all to authenticated
  using (true) with check (true);

-- Photos : visibles si le projet parent est publié ; écriture authentifiée.
drop policy if exists photos_read on public.photos;
create policy photos_read on public.photos for select using (
  exists (select 1 from public.projects p where p.id = photos.project_id and p.published)
);
drop policy if exists photos_manage on public.photos;
create policy photos_manage on public.photos for all to authenticated
  using (true) with check (true);

-- Vidéos : même règle que les photos.
drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (
  exists (select 1 from public.projects p where p.id = videos.project_id and p.published)
);
drop policy if exists videos_manage on public.videos;
create policy videos_manage on public.videos for all to authenticated
  using (true) with check (true);

-- Messages : insertion anonyme autorisée ; lecture/gestion authentifiée.
drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages for insert with check (true);
drop policy if exists messages_manage on public.messages;
create policy messages_manage on public.messages for all to authenticated
  using (true) with check (true);

-- Contenu éditorial : lecture publique, écriture authentifiée.
drop policy if exists site_content_read on public.site_content;
create policy site_content_read on public.site_content for select using (true);
drop policy if exists site_content_manage on public.site_content;
create policy site_content_manage on public.site_content for all to authenticated
  using (true) with check (true);

-- ============================================================ STORAGE

insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do nothing;

drop policy if exists portfolio_read on storage.objects;
create policy portfolio_read on storage.objects for select
  using (bucket_id = 'portfolio');

drop policy if exists portfolio_write on storage.objects;
create policy portfolio_write on storage.objects for all to authenticated
  using (bucket_id = 'portfolio') with check (bucket_id = 'portfolio');
