-- JKStudio — médiathèque (banque photo façon drive, admin uniquement).
-- À exécuter après 0005. Idempotent. Non destructif.
--
-- La médiathèque est un STOCK d'images côté admin, organisé en dossiers. Elle
-- n'est JAMAIS affichée sur le site public : le cloisonnement est garanti au
-- niveau de la base (RLS réservée aux comptes authentifiés — pas de lecture
-- anonyme), pas seulement dans le code. Seules les photos réellement
-- rattachées à une série/catégorie (table `photos`) apparaissent sur le site.
--
-- Modèle « référence » : rattacher une photo de la médiathèque à une série
-- fait pointer la ligne `photos` vers le MÊME fichier Storage (aucune copie),
-- via `photos.asset_id` + un `storage_path` partagé. Le rendu public, qui lit
-- déjà `photos.storage_path`, fonctionne donc sans modification.

-- ============================================================ DOSSIERS

create table if not exists public.media_folders (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  -- Dossiers imbriquables. La suppression d'un dossier supprime ses
  -- sous-dossiers ; les fichiers, eux, remontent à la racine (voir ci-dessous).
  parent_id  uuid references public.media_folders(id) on delete cascade,
  position   int  not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists media_folders_parent_idx
  on public.media_folders (parent_id);

-- ============================================================ FICHIERS

create table if not exists public.media_assets (
  id            uuid primary key default gen_random_uuid(),
  -- Supprimer un dossier ne détruit pas les images : elles reviennent à la
  -- racine (folder_id NULL) plutôt que d'être perdues.
  folder_id     uuid references public.media_folders(id) on delete set null,
  -- Clé Storage du fichier, unique : une même image n'entre qu'une fois dans
  -- la banque.
  storage_path  text not null unique,
  filename      text,
  alt           text,
  width         int,
  height        int,
  orientation   public.photo_orientation,
  blur_data_url text,
  variant_widths integer[],
  created_at    timestamptz not null default now()
);

create index if not exists media_assets_folder_idx
  on public.media_assets (folder_id);

-- ============================================================ LIEN PHOTOS → BANQUE

-- Provenance d'une photo affichée. NULL pour les photos importées avant la
-- médiathèque (elles continuent de rendre via leur storage_path). Sur
-- suppression d'un asset, la photo garde son fichier et perd juste le lien —
-- mais l'action admin bloque la suppression d'un asset encore référencé.
alter table public.photos
  add column if not exists asset_id uuid
    references public.media_assets(id) on delete set null;

create index if not exists photos_asset_idx on public.photos (asset_id);

-- ============================================================ RLS
--
-- Réservé aux comptes authentifiés, EN LECTURE COMME EN ÉCRITURE. Aucune
-- politique de lecture publique : le rôle anon ne peut ni lister ni lire la
-- médiathèque. C'est ce qui garantit qu'elle n'apparaît jamais sur le site.

alter table public.media_folders enable row level security;
alter table public.media_assets  enable row level security;

drop policy if exists media_folders_manage on public.media_folders;
create policy media_folders_manage on public.media_folders for all to authenticated
  using (true) with check (true);

drop policy if exists media_assets_manage on public.media_assets;
create policy media_assets_manage on public.media_assets for all to authenticated
  using (true) with check (true);
