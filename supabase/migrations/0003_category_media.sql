-- JKStudio — photos & vidéos rattachables directement à une catégorie
-- (en plus des séries). À exécuter après 0002. Idempotent.

-- project_id devient optionnel ; ajout d'un category_id optionnel.
alter table public.photos alter column project_id drop not null;
alter table public.photos add column if not exists category_id uuid
  references public.categories(id) on delete cascade;
alter table public.videos alter column project_id drop not null;
alter table public.videos add column if not exists category_id uuid
  references public.categories(id) on delete cascade;

-- Exactement un parent : soit une série, soit une catégorie.
alter table public.photos drop constraint if exists photos_one_parent;
alter table public.photos add constraint photos_one_parent
  check ((project_id is null) <> (category_id is null));
alter table public.videos drop constraint if exists videos_one_parent;
alter table public.videos add constraint videos_one_parent
  check ((project_id is null) <> (category_id is null));

create index if not exists photos_category_idx on public.photos (category_id);
create index if not exists videos_category_idx on public.videos (category_id);

-- RLS : média visible si (série publiée) OU (rattaché à une catégorie).
drop policy if exists photos_read on public.photos;
create policy photos_read on public.photos for select using (
  (project_id is not null and exists (
    select 1 from public.projects p where p.id = photos.project_id and p.published))
  or (category_id is not null)
);

drop policy if exists videos_read on public.videos;
create policy videos_read on public.videos for select using (
  (project_id is not null and exists (
    select 1 from public.projects p where p.id = videos.project_id and p.published))
  or (category_id is not null)
);
