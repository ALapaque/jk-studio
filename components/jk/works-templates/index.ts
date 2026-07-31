import { WorksClassic } from "./classic";
import { WorksList } from "./list";
import { WorksContactSheet } from "./contactSheet";
import { WorksSpread } from "./spread";
import { WorksFeature } from "./feature";
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
  {
    key: "list",
    label: "Index typographique",
    description:
      "Catégories en titres, séries listées dessous avec aperçu de la cover au survol. Dense, éditorial.",
    Component: WorksList,
  },
  {
    key: "contactSheet",
    label: "Planche contact",
    description:
      "Grille dense de toutes les séries (une vignette par série, toutes catégories). Vue d'ensemble.",
    Component: WorksContactSheet,
  },
  {
    key: "spread",
    label: "Double page",
    description:
      "Toutes les séries en galerie double page : covers gauche/droite qui parallaxent au défilement.",
    Component: WorksSpread,
  },
  {
    key: "feature",
    label: "Une à la une",
    description:
      "La première catégorie en grande affiche plein cadre, les autres en index de lignes.",
    Component: WorksFeature,
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
