import { SeriesClassic } from "./classic";
import { SeriesContactSheet } from "./contactSheet";
import { SeriesCinema } from "./cinema";
import { SeriesSplit } from "./split";
import { SeriesFrames } from "./frames";
import type { SeriesTemplateEntry, SeriesTemplateProps } from "./types";

export type { SeriesTemplateProps, SeriesTemplateEntry } from "./types";

/** Registre des templates de page détail de série.
 *
 *  L'ordre est celui du sélecteur en admin. Le premier (`classic`) est le
 *  défaut : toute clé inconnue y retombe (`getSeriesTemplate`). Ajouter une
 *  variante = ajouter une entrée ici + son composant. */
export const SERIES_TEMPLATES: SeriesTemplateEntry[] = [
  {
    key: "classic",
    label: "Défilé immersif",
    description:
      "Cover plein écran, puis une photo par écran avec parallaxe. La mise en page actuelle.",
    Component: SeriesClassic,
  },
  {
    key: "contactSheet",
    label: "Planche contact",
    description:
      "Grille dense et numérotée de toutes les images, façon planche de tirage. Lecture d'archive.",
    Component: SeriesContactSheet,
  },
  {
    key: "cinema",
    label: "Cinéma",
    description:
      "Images plein cadre empilées, parallaxe ample et grandes légendes serif. Défilement continu.",
    Component: SeriesCinema,
  },
  {
    key: "split",
    label: "Double page",
    description:
      "Image d'un côté, légende de l'autre, côté alterné — une double page de magazine.",
    Component: SeriesSplit,
  },
  {
    key: "frames",
    label: "Mur de galerie",
    description:
      "Beaucoup de vide, images encadrées au laiton et cartels centrés. Accrochage d'exposition.",
    Component: SeriesFrames,
  },
];

/** Descripteurs seuls (sans composant) — sérialisables pour l'admin client. */
export const SERIES_TEMPLATE_OPTIONS = SERIES_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

/** Résout une clé de template vers son composant, avec repli `classic`. */
export function getSeriesTemplate(
  key: string | null | undefined,
): (props: SeriesTemplateProps) => React.ReactNode {
  const found = SERIES_TEMPLATES.find((t) => t.key === key);
  return (found ?? SERIES_TEMPLATES[0]).Component;
}
