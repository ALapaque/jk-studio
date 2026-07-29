-- JKStudio — annulation de 0004_series_captions.sql.
--
-- ATTENTION : ce rollback SUPPRIME les colonnes ajoutées par 0004, donc les
-- légendes éditoriales saisies depuis l'admin, les LQIP et les métadonnées de
-- série. Exporter ces données avant de l'exécuter si elles ont de la valeur :
--
--   copy (select id, subject, location, orientation, blur_data_url
--         from public.photos)
--     to '/tmp/photos_0004_backup.csv' with csv header;
--   copy (select id, shot_at, intro from public.projects)
--     to '/tmp/projects_0004_backup.csv' with csv header;
--
-- Le schéma revient à l'état de 0003 ; le site rend alors comme avant la
-- refonte, puisque 0004 n'ajoute que des champs optionnels.

drop index if exists public.photos_project_position_idx;

alter table public.photos drop column if exists blur_data_url;
alter table public.photos drop column if exists orientation;
alter table public.photos drop column if exists location;
alter table public.photos drop column if exists subject;

-- Le type énuméré n'est supprimable qu'une fois la colonne qui l'utilise
-- retirée (ci-dessus).
drop type if exists public.photo_orientation;

alter table public.projects drop column if exists intro;
alter table public.projects drop column if exists shot_at;
