import { VideoProvider } from "./video";

export interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
  /** ratio CSS, ex. "3 / 4" */
  ar: string;
  alt: string;
  caption: string;
  meta: string; // lieu, année
}

export interface Video {
  id: string;
  provider: VideoProvider;
  videoId: string;
  title: string;
  meta: string;
  duration?: string;
}

/** Média unifié pour les grilles / lightbox. */
export type Media =
  | ({ kind: "photo" } & Photo)
  | ({ kind: "video" } & Video);

export interface Series {
  slug: string;
  title: string;
  description: string;
  location: string;
  period: string;
  coverSrc: string;
  photos: Photo[];
  videos: Video[];
}

export interface Category {
  slug: string;
  num: string;
  title: string;
  /** libellé court pour l'unité (photos / films) */
  unit: string;
  subtitle?: string;
  description: string;
  location: string;
  period: string;
  coverSrc: string;
  series: Series[];
  /** Photos/vidéos rattachées directement à la catégorie (hors séries). */
  directMedia?: Media[];
}

/** Ordonne les médias d'une série (photos puis vidéos, ou selon position). */
export function seriesMedia(s: Series): Media[] {
  return [
    ...s.photos.map((p) => ({ kind: "photo" as const, ...p })),
    ...s.videos.map((v) => ({ kind: "video" as const, ...v })),
  ];
}

/** Tous les médias d'une catégorie (agrégés sur ses séries). */
export function categoryMedia(c: Category): Media[] {
  return c.series.flatMap(seriesMedia);
}

export function countLabel(c: Category): string {
  let nP = 0;
  let nV = 0;
  for (const s of c.series) {
    nP += s.photos.length;
    nV += s.videos.length;
  }
  for (const m of c.directMedia ?? []) {
    if (m.kind === "photo") nP += 1;
    else nV += 1;
  }
  if (!nP) return `${nV} ${nV > 1 ? "films" : "film"}`;
  if (!nV) return `${nP} photos`;
  return `${nP} photos · ${nV} ${nV > 1 ? "films" : "film"}`;
}
