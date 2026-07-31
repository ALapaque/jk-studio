import { ContactClassic } from "./classic";
import { ContactSplitCover } from "./splitCover";
import { ContactMinimal } from "./minimal";
import { ContactAside } from "./aside";
import { ContactCard } from "./card";
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
  {
    key: "split-cover",
    label: "Panneau & carte",
    description:
      "Panneau plein à gauche (accroche + coordonnées en grand), formulaire en carte à droite.",
    Component: ContactSplitCover,
  },
  {
    key: "minimal",
    label: "Minimal centré",
    description:
      "Une colonne étroite et centrée : accroche, titre, lead puis formulaire. Très sobre.",
    Component: ContactMinimal,
  },
  {
    key: "aside",
    label: "Titre & barre latérale",
    description:
      "Grand titre + lead en pleine largeur, formulaire au centre, coordonnées en barre latérale.",
    Component: ContactAside,
  },
  {
    key: "card",
    label: "Carte",
    description:
      "Titre centré, formulaire dans une carte encadrée sur fond surface. Net et posé.",
    Component: ContactCard,
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
