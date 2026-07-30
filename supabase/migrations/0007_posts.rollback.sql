-- Annulation de 0007_posts.sql. Destructif : supprime tous les articles.
drop policy if exists posts_read on public.posts;
drop policy if exists posts_manage on public.posts;
drop table if exists public.posts;
