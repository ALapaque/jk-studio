import { PostClassic } from "./classic";
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
