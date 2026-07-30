-- Rollback de 0009_project_template.sql.
alter table public.projects
  drop column if exists template;
