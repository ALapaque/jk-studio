import type { Photo, Series } from "@/lib/types";

/** Données normalisées passées à chaque template de page détail de série.
 *  Dérivées dans un util partagé (`lib/series-view.ts`) pour que le rendu
 *  public et l'aperçu admin nourrissent les templates de la même façon. */
export interface SeriesTemplateProps {
  /** Catégorie parente — seuls les champs utiles au rendu. */
  category: { num: string; title: string; slug: string };
  series: Series;
  photos: Photo[];
  /** Série suivante de la catégorie (pour le pied de page), ou `null`. */
  next: Series | null;
  /** Lien de retour à l'index de la catégorie. */
  indexHref: string;
}

/** Descripteur d'un template dans le registre. */
export interface SeriesTemplateEntry {
  key: string;
  label: string;
  description: string;
  Component: (props: SeriesTemplateProps) => React.ReactNode;
}
