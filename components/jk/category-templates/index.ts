import { CategoryClassic } from "./classic";
import type { CategoryTemplateEntry, CategoryTemplateProps } from "./types";

export type { CategoryTemplateProps, CategoryTemplateEntry } from "./types";

/** Registre des templates de page catégorie. Premier = défaut. */
export const CATEGORY_TEMPLATES: CategoryTemplateEntry[] = [
  {
    key: "classic",
    label: "Cover & sections",
    description:
      "En-tête en cover, liste des séries puis sélection de médias. La mise en page actuelle.",
    Component: CategoryClassic,
  },
];

export const CATEGORY_TEMPLATE_OPTIONS = CATEGORY_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getCategoryTemplate(
  key: string | null | undefined,
): (props: CategoryTemplateProps) => React.ReactNode {
  const found = CATEGORY_TEMPLATES.find((t) => t.key === key);
  return (found ?? CATEGORY_TEMPLATES[0]).Component;
}
