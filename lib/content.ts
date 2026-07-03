// Contenu éditorial du site. En Phase 1 il est statique (valeurs de la
// maquette). En Phase 2, ces getters liront la table `site_content` de
// Supabase — l'interface reste identique pour que les pages ne changent pas.

import "server-only";
import { Appearance, DEFAULT_APPEARANCE } from "./theme";
import { isSupabaseConfigured } from "./env";
import { createPublicSupabase } from "./supabase/server";

export interface Fact {
  k: string;
  v: string;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    titleLines: string[];
    coords: string;
    categoriesLine: string;
  };
  studio: {
    lead: string;
    leadEm: string;
    paragraph: string;
    facts: Fact[];
  };
  about: {
    title: string;
    portraitCaption: string;
    portraitYear: string;
    paragraphs: string[];
    facts: Fact[];
    principles: string[];
  };
  contact: {
    title: string;
    lead: string;
    email: string;
    facts: Fact[];
    response: string;
    projectTypes: string[];
  };
  footer: {
    copyright: string;
    location: string;
    socials: string[];
  };
}

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    eyebrow: "Studio photo & vidéo — Bruxelles",
    titleLines: ["Entrez", "dans l’image."],
    coords: "50.8467° N — 4.3499° E",
    categoriesLine: "Portrait · Mariage · Mode · Gaming · Vidéo",
  },
  studio: {
    lead: "Je photographie ce qui ne se rejoue pas — ",
    leadEm: "un regard, une main, la seconde juste avant.",
    paragraph:
      "JKStudio est un studio photo & vidéo installé à Bruxelles. Portraits, mariages, mode, culture gaming — toujours la même obsession : une lumière honnête et des gens vrais.",
    facts: [
      { k: "Depuis", v: "2018" },
      { k: "Base", v: "Bruxelles — mobile partout" },
      { k: "Langues", v: "FR · EN · NL" },
    ],
  },
  about: {
    title: "Derrière l’objectif.",
    portraitCaption: "JK — autoportrait au 50 mm",
    portraitYear: "2025",
    paragraphs: [
      "Derrière JKStudio, il y a une personne et deux boîtiers. J’ai commencé par photographier mes amis en LAN, puis leurs mariages, puis des podiums. Le fil rouge n’a jamais changé : des images qui ressemblent aux gens, pas à des poses.",
      "Je travaille lentement, en petite équipe, à la lumière disponible dès que possible. La vidéo est venue naturellement — les mêmes histoires, en mouvement.",
    ],
    facts: [
      { k: "2018", v: "Premières commandes" },
      { k: "120+ projets", v: "Belgique & voisins" },
      { k: "Pratique", v: "Photo · Vidéo · Direction artistique" },
    ],
    principles: [
      "Écouter d’abord — le brief est une conversation.",
      "Lumière honnête — peu d’artifices, beaucoup d’attention.",
      "Livrer des images qui durent — pas des tendances.",
    ],
  },
  contact: {
    title: "Écrivons-le en images.",
    lead: "Un portrait, un mariage, une campagne, un tournoi ? Racontez-moi le projet en quelques lignes.",
    email: "hello@jkstudio.be",
    facts: [
      { k: "Instagram", v: "@jkstudio.bxl" },
      { k: "Vimeo", v: "jkstudio" },
      { k: "Studio", v: "Rue du Bailli, Bruxelles" },
    ],
    response: "Réponse sous 48 h — devis gratuit",
    projectTypes: ["Portrait", "Mariage", "Mode", "Gaming", "Vidéo", "Autre"],
  },
  footer: {
    copyright: "© JKStudio — 2026",
    location: "Bruxelles, BE — 50.85° N",
    socials: ["Instagram", "Vimeo", "LinkedIn"],
  },
};

/** Clés attendues dans la table site_content. */
export const CONTENT_KEYS = [
  "hero",
  "studio",
  "about",
  "contact",
  "footer",
] as const;

async function readContentMap(): Promise<Record<string, unknown>> {
  if (!isSupabaseConfigured()) return {};
  try {
    const sb = createPublicSupabase();
    const { data, error } = await sb.from("site_content").select("key, value");
    if (error) throw error;
    const map: Record<string, unknown> = {};
    for (const row of data ?? []) map[row.key] = row.value;
    return map;
  } catch (err) {
    console.error("[content] lecture Supabase échouée, repli défauts:", err);
    return {};
  }
}

function merge<T extends object>(base: T, override: unknown): T {
  if (!override || typeof override !== "object") return base;
  return { ...base, ...(override as Partial<T>) };
}

export async function getSiteContent(): Promise<SiteContent> {
  const map = await readContentMap();
  return {
    hero: merge(DEFAULT_CONTENT.hero, map.hero),
    studio: merge(DEFAULT_CONTENT.studio, map.studio),
    about: merge(DEFAULT_CONTENT.about, map.about),
    contact: merge(DEFAULT_CONTENT.contact, map.contact),
    footer: merge(DEFAULT_CONTENT.footer, map.footer),
  };
}

export async function getAppearance(): Promise<Appearance> {
  const map = await readContentMap();
  return merge(DEFAULT_APPEARANCE, map.appearance);
}
