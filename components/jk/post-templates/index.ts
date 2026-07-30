import { PostClassic } from "./classic";
import { PostMagazine } from "./magazine";
import { PostMinimal } from "./minimal";
import { PostGalleryFirst } from "./galleryFirst";
import { PostFeature } from "./feature";
import type { PostTemplateEntry, PostTemplateProps } from "./types";

export type { PostTemplateProps, PostTemplateEntry } from "./types";

/** Registre des templates de page détail d'article. Premier = défaut ; toute
 *  clé inconnue retombe sur `classic` (`getPostTemplate`). */
export const POST_TEMPLATES: PostTemplateEntry[] = [
  {
    key: "classic",
    label: "Éditorial",
    description:
      "Header serif, cover en parallaxe, corps de lecture étroit, galerie large en fin. La mise en page actuelle.",
    Component: PostClassic,
  },
  {
    key: "magazine",
    label: "Magazine",
    description:
      "Titre surimprimé sur la cover, corps ouvert par une lettrine, galerie large. Ouverture de magazine.",
    Component: PostMagazine,
  },
  {
    key: "minimal",
    label: "Minimal",
    description:
      "Pas de hero, colonne étroite et typographie sobre. Pour un texte long ou une note d'intention.",
    Component: PostMinimal,
  },
  {
    key: "galleryFirst",
    label: "Galerie d'abord",
    description:
      "Mosaïque d'images en tête, texte ensuite. Quand l'image raconte avant les mots.",
    Component: PostGalleryFirst,
  },
  {
    key: "feature",
    label: "Grand format",
    description:
      "Cover plein écran, titre centré en surimpression, galerie large. Pour une histoire phare.",
    Component: PostFeature,
  },
];

/** Descripteurs seuls (sans composant) — sérialisables pour l'admin client. */
export const POST_TEMPLATE_OPTIONS = POST_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

/** Résout une clé de template vers son composant, avec repli `classic`. */
export function getPostTemplate(
  key: string | null | undefined,
): (props: PostTemplateProps) => React.ReactNode {
  const found = POST_TEMPLATES.find((t) => t.key === key);
  return (found ?? POST_TEMPLATES[0]).Component;
}
