import { HomeClassic } from "./classic";
import type { HomeTemplateEntry, HomeTemplateProps } from "./types";

export type { HomeTemplateProps, HomeTemplateEntry } from "./types";

/** Registre des templates de la page d'accueil. Premier = défaut. */
export const HOME_TEMPLATES: HomeTemplateEntry[] = [
  {
    key: "classic",
    label: "Hero & séquence",
    description:
      "Hero plein écran, studio, sélection puis catégories. La mise en page actuelle.",
    Component: HomeClassic,
  },
];

export const HOME_TEMPLATE_OPTIONS = HOME_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getHomeTemplate(
  key: string | null | undefined,
): (props: HomeTemplateProps) => React.ReactNode {
  const found = HOME_TEMPLATES.find((t) => t.key === key);
  return (found ?? HOME_TEMPLATES[0]).Component;
}
