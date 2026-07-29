-- JKStudio — refonte, Lot 1 : légendes éditoriales & métadonnées de série.
-- À exécuter après 0003. Idempotent.
--
-- NON DESTRUCTIF : uniquement des ajouts de colonnes nullables. Aucune colonne
-- n'est supprimée ni renommée, aucune contrainte existante n'est durcie. Le
-- site continue de rendre exactement comme avant tant que les nouveaux champs
-- sont vides (voir 0004_series_captions.rollback.sql pour l'annulation).
--
-- Note de nommage : la « table series » du brief de refonte correspond à la
-- table `projects` existante. Elle est conservée sous ce nom en base — la
-- renommer casserait les FK, les politiques RLS et le code applicatif. Le
-- vocabulaire « série » est exposé côté types/UI uniquement.

-- ============================================================ SÉRIES (projects)

-- Date de prise de vue, distincte de `period` (texte libre déjà affiché,
-- ex. « Mars 2026 »). `shot_at` permet un tri chronologique fiable.
alter table public.projects add column if not exists shot_at date;

-- Chapô éditorial de 2-3 phrases affiché sur l'écran d'ouverture du défilé.
alter table public.projects add column if not exists intro text;

-- ============================================================ PHOTOS

-- Légende éditoriale, en deux parties : « <subject> — <LOCATION> ».
-- `subject` s'affiche en serif italique, `location` en capitales espacées.
-- Volontairement distinctes de `caption` (legacy, texte libre d'un seul tenant)
-- afin de ne pas réinterpréter les données existantes.
alter table public.photos add column if not exists subject  text;
alter table public.photos add column if not exists location text;

-- Orientation calculée à l'upload : les paysages passent en plein cadre
-- (cover), les portraits sont centrés avec marges (contain) — on ne crope
-- jamais une verticale.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'photo_orientation') then
    create type public.photo_orientation as enum ('portrait', 'landscape');
  end if;
end $$;

alter table public.photos
  add column if not exists orientation public.photo_orientation;

-- LQIP (placeholder flouté) généré à l'upload, consommé par `blurDataURL`
-- de next/image pour supprimer le décalage de layout au chargement.
alter table public.photos add column if not exists blur_data_url text;

-- Tri narratif : `position` existe déjà et joue ce rôle. Cet index sert le
-- défilé, qui lit les photos d'une série dans l'ordre de montage.
create index if not exists photos_project_position_idx
  on public.photos (project_id, position);

-- ============================================================ RLS
--
-- Aucune politique n'est modifiée. Les politiques de 0001/0003 s'appliquent au
-- niveau de la ligne : les colonnes ajoutées ici héritent automatiquement de
-- « lecture publique si la série parente est publiée, écriture réservée aux
-- comptes authentifiés ». Rien à ajouter.
