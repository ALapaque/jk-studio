import { HomeClassic } from "./classic";
import { HomeEditorial } from "./editorial";
import { HomeShowcase } from "./showcase";
import { HomeSpread } from "./spread";
import { HomePoster } from "./poster";
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
  {
    key: "editorial",
    label: "Éditorial",
    description:
      "Hero réduit à une bande titrée (accroche + grand titre), catégories mises en avant, puis studio et sélection. Entrée par le sommaire.",
    Component: HomeEditorial,
  },
  {
    key: "showcase",
    label: "Vitrine",
    description:
      "Hero plein écran puis une grande mosaïque « sélection » comme pièce maîtresse, studio et catégories ensuite. Le travail d'abord.",
    Component: HomeShowcase,
  },
  {
    key: "spread",
    label: "Double page",
    description:
      "Hero plein écran, puis la sélection en galerie double page (covers gauche/droite qui parallaxent), catégories en pied.",
    Component: HomeSpread,
  },
  {
    key: "poster",
    label: "Affiche",
    description:
      "Une seule grande image plein écran, nom et titre en surimpression, index de catégories minimal en pied.",
    Component: HomePoster,
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
