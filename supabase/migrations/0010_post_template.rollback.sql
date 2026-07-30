-- Rollback de 0010_post_template.sql.
alter table public.posts
  drop column if exists template;
