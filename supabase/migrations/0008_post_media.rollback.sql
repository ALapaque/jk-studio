-- Annulation de 0008_post_media.sql. Retire la galerie média des articles.
alter table public.posts drop column if exists media;
