-- JKStudio — annulation de 0006_media_library.sql.
--
-- ⚠️ Supprime la médiathèque (dossiers + fiches d'images) et le lien de
-- provenance des photos. Les FICHIERS restent dans le Storage — seules les
-- fiches de la banque disparaissent. Les photos déjà affichées sur le site
-- continuent de rendre (elles gardent leur storage_path), elles perdent juste
-- le lien vers la banque.

alter table public.photos drop column if exists asset_id;

drop table if exists public.media_assets;
drop table if exists public.media_folders;
