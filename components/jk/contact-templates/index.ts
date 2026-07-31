import { ContactClassic } from "./classic";
import type { ContactTemplateEntry, ContactTemplateProps } from "./types";

export type { ContactTemplateProps, ContactTemplateEntry } from "./types";

/** Registre des templates de la page Contact. Premier = défaut. */
export const CONTACT_TEMPLATES: ContactTemplateEntry[] = [
  {
    key: "classic",
    label: "Deux colonnes",
    description:
      "Accroche et coordonnées à gauche, formulaire à droite. La mise en page actuelle.",
    Component: ContactClassic,
  },
];

export const CONTACT_TEMPLATE_OPTIONS = CONTACT_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getContactTemplate(
  key: string | null | undefined,
): (props: ContactTemplateProps) => React.ReactNode {
  const found = CONTACT_TEMPLATES.find((t) => t.key === key);
  return (found ?? CONTACT_TEMPLATES[0]).Component;
}
