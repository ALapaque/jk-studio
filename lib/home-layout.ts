// Modèle de composition de la page d'accueil.
//
// Le photographe compose sa page depuis l'admin (Contenu → Accueil) : il choisit
// les sections affichées, leur ordre (glisser-déposer), et quelques options par
// section (hero plein écran, variante de mise en page). Le template d'accueil
// « builder » lit cette structure et rend les blocs dans l'ordre.
//
// Fichier volontairement pur (ni server-only, ni "use client") : il est partagé
// par le rendu serveur (`content.ts`, blocs), l'action d'enregistrement et
// l'éditeur client.

export type HomeSectionType =
  | "hero"
  | "intro"
  | "selection"
  | "categories"
  | "proof";

/** Une section de l'accueil, telle qu'ordonnée et réglée par le photographe. */
export interface HomeSection {
  type: HomeSectionType;
  enabled: boolean;
  /** Hero uniquement : image plein écran avec texte par-dessus (true) ou hero
   *  éditorial deux colonnes (false). */
  fullscreen?: boolean;
  /** Variante de mise en page, selon la section (voir HOME_SECTION_META). */
  variant?: string;
}

export interface HomeLayout {
  sections: HomeSection[];
}

export const HOME_SECTION_TYPES: HomeSectionType[] = [
  "hero",
  "intro",
  "selection",
  "categories",
  "proof",
];

/** Composition par défaut = l'accueil classique. Utilisée tant que le
 *  photographe n'a rien personnalisé. */
export const DEFAULT_HOME_LAYOUT: HomeLayout = {
  sections: [
    { type: "hero", enabled: true, fullscreen: true },
    { type: "intro", enabled: true, variant: "standard" },
    { type: "proof", enabled: true },
    { type: "selection", enabled: true, variant: "grid" },
    { type: "categories", enabled: true, variant: "rows" },
  ],
};

/** Métadonnées d'une section pour l'éditeur admin : libellé, aide, variantes
 *  disponibles et présence de l'option plein écran. */
export interface SectionMeta {
  type: HomeSectionType;
  label: string;
  description: string;
  hasFullscreen?: boolean;
  variants?: { key: string; label: string }[];
}

export const HOME_SECTION_META: Record<HomeSectionType, SectionMeta> = {
  hero: {
    type: "hero",
    label: "Hero",
    description: "L'ouverture de la page (image + accroche).",
    hasFullscreen: true,
  },
  intro: {
    type: "intro",
    label: "Présentation",
    description: "Le bloc « studio » : accroche, texte et quelques faits.",
    variants: [
      { key: "standard", label: "Deux colonnes (portrait + texte)" },
      { key: "centered", label: "Centrée" },
    ],
  },
  selection: {
    type: "selection",
    label: "Derniers projets",
    description: "Une sélection de séries récentes.",
    variants: [
      { key: "grid", label: "Grille" },
      { key: "stories", label: "Cartes « histoires »" },
      { key: "spread", label: "Double page (parallaxe)" },
    ],
  },
  categories: {
    type: "categories",
    label: "Catégories",
    description: "L'index des catégories.",
    variants: [
      { key: "rows", label: "Lignes" },
      { key: "alternating", label: "Grandes sections alternées" },
    ],
  },
  proof: {
    type: "proof",
    label: "Preuve sociale",
    description:
      "Le bandeau de logos/clients (n'apparaît que s'il est activé et rempli dans l'onglet « Preuve sociale »).",
  },
};

/** Presets reprenant les mises en page existantes. Le photographe part de l'un
 *  d'eux puis ajuste. */
export interface HomeLayoutPreset {
  key: string;
  label: string;
  description: string;
  sections: HomeSection[];
}

export const HOME_LAYOUT_PRESETS: HomeLayoutPreset[] = [
  {
    key: "classic",
    label: "Classique",
    description: "Hero plein écran, présentation, sélection, catégories.",
    sections: [
      { type: "hero", enabled: true, fullscreen: true },
      { type: "intro", enabled: true, variant: "standard" },
      { type: "proof", enabled: true },
      { type: "selection", enabled: true, variant: "grid" },
      { type: "categories", enabled: true, variant: "rows" },
    ],
  },
  {
    key: "editorial",
    label: "Éditorial",
    description: "Catégories mises en avant juste après le hero.",
    sections: [
      { type: "hero", enabled: true, fullscreen: true },
      { type: "categories", enabled: true, variant: "rows" },
      { type: "intro", enabled: true, variant: "standard" },
      { type: "selection", enabled: true, variant: "grid" },
    ],
  },
  {
    key: "showcase",
    label: "Vitrine",
    description: "La sélection en pièce maîtresse, juste après le hero.",
    sections: [
      { type: "hero", enabled: true, fullscreen: true },
      { type: "selection", enabled: true, variant: "grid" },
      { type: "intro", enabled: true, variant: "standard" },
      { type: "categories", enabled: true, variant: "rows" },
    ],
  },
  {
    key: "spread",
    label: "Double page",
    description: "La sélection en galerie double page qui parallaxe.",
    sections: [
      { type: "hero", enabled: true, fullscreen: true },
      { type: "selection", enabled: true, variant: "spread" },
      { type: "intro", enabled: true, variant: "standard" },
      { type: "categories", enabled: true, variant: "rows" },
    ],
  },
  {
    key: "margauxgatti",
    label: "Margaux Gatti",
    description:
      "Hero éditorial deux colonnes, présentation centrée, cartes histoires, catégories en grandes sections alternées.",
    sections: [
      { type: "hero", enabled: true, fullscreen: false },
      { type: "intro", enabled: true, variant: "centered" },
      { type: "selection", enabled: true, variant: "stories" },
      { type: "categories", enabled: true, variant: "alternating" },
    ],
  },
];

/** Valide/assainit une valeur brute (JSON de la base ou du formulaire) en un
 *  HomeLayout sûr. Repli sur la composition par défaut si rien d'exploitable. */
export function normalizeHomeLayout(value: unknown): HomeLayout {
  const raw =
    value && typeof value === "object"
      ? (value as { sections?: unknown }).sections
      : undefined;
  if (!Array.isArray(raw)) return DEFAULT_HOME_LAYOUT;

  const seen = new Set<HomeSectionType>();
  const sections: HomeSection[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const t = (item as { type?: unknown }).type;
    if (typeof t !== "string" || !HOME_SECTION_TYPES.includes(t as HomeSectionType))
      continue;
    const type = t as HomeSectionType;
    if (seen.has(type)) continue; // une section de chaque type au plus
    seen.add(type);
    const s: HomeSection = {
      type,
      enabled: (item as { enabled?: unknown }).enabled !== false,
    };
    const variant = (item as { variant?: unknown }).variant;
    if (typeof variant === "string" && variant) s.variant = variant;
    if (type === "hero")
      s.fullscreen = (item as { fullscreen?: unknown }).fullscreen !== false;
    sections.push(s);
  }
  return sections.length ? { sections } : DEFAULT_HOME_LAYOUT;
}
