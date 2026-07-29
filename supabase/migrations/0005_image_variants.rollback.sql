-- JKStudio — annulation de 0005_image_variants.sql.
--
-- Supprime le registre des dérivés. Les fichiers restent dans le Storage
-- (ils ne sont pas effacés ici) ; le site cesse simplement de les servir et
-- retombe sur /_next/image, comme avant le Lot 4.
--
-- Pour supprimer aussi les fichiers, filtrer le bucket sur le suffixe
-- `@<largeur>.webp` avant d'exécuter ce rollback — sinon la liste des
-- largeurs est perdue et les dérivés deviennent orphelins.

alter table public.photos drop column if exists variant_widths;
