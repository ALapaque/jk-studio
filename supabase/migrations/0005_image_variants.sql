-- JKStudio — refonte, Lot 4 : variantes d'images générées à l'upload.
-- À exécuter après 0004. Idempotent.
--
-- NON DESTRUCTIF : une seule colonne nullable ajoutée.
--
-- Pourquoi une colonne plutôt qu'une convention implicite : le rendu doit
-- savoir AVANT d'écrire le srcSet si les dérivés existent pour cette photo.
-- Les déduire d'une convention de nommage obligerait soit à faire confiance
-- sans vérifier (et à servir des 404 aux visiteurs pour toute photo
-- antérieure au backfill), soit à sonder le Storage à chaque rendu. La
-- colonne rend l'information explicite et interrogeable.
--
-- `null` ou tableau vide = aucune variante → le rendu retombe sur
-- l'optimiseur Next, exactement comme avant. La bascule est donc progressive,
-- photo par photo, sans jamais casser l'existant.

alter table public.photos
  add column if not exists variant_widths integer[];

comment on column public.photos.variant_widths is
  'Largeurs des dérivés WebP présents dans le Storage, en px. NULL = aucun ; le rendu retombe alors sur /_next/image.';
