import { WorksClassic } from "./classic";
import type { WorksTemplateEntry, WorksTemplateProps } from "./types";

export type { WorksTemplateProps, WorksTemplateEntry } from "./types";

/** Registre des templates de l'index Portfolio (/travaux). Premier = défaut. */
export const WORKS_TEMPLATES: WorksTemplateEntry[] = [
  {
    key: "classic",
    label: "Affiches",
    description:
      "Chaque catégorie en grande affiche (cover plein cadre + titre). La mise en page actuelle.",
    Component: WorksClassic,
  },
];

export const WORKS_TEMPLATE_OPTIONS = WORKS_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getWorksTemplate(
  key: string | null | undefined,
): (props: WorksTemplateProps) => React.ReactNode {
  const found = WORKS_TEMPLATES.find((t) => t.key === key);
  return (found ?? WORKS_TEMPLATES[0]).Component;
}
