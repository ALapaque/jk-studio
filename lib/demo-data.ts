// Données de démonstration — transcrites du tableau CATS de la maquette,
// réorganisées en taxonomie catégorie → série → médias. Les vidéos, qui
// étaient des MP4 dans la maquette, deviennent des embeds YouTube/Vimeo de
// démonstration (le photographe les remplacera via l'admin en Phase 2).

import { Category, Photo, Series, Video } from "./types";
import { VideoProvider } from "./video";

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&h=${h}&fit=crop&auto=format`;

let pid = 0;
const ph = (
  id: string,
  w: number,
  h: number,
  ar: string,
  caption: string,
  meta: string,
): Photo => ({
  id: `p${pid++}`,
  src: IMG(id, w, h),
  width: w,
  height: h,
  ar,
  alt: caption,
  caption,
  meta,
});

let vid = 0;
const vd = (
  provider: VideoProvider,
  videoId: string,
  title: string,
  meta: string,
  duration: string,
): Video => ({ id: `v${vid++}`, provider, videoId, title, meta, duration });

const mkSeries = (
  slug: string,
  title: string,
  description: string,
  location: string,
  period: string,
  photos: Photo[],
  videos: Video[] = [],
  coverId?: string,
): Series => ({
  slug,
  title,
  description,
  location,
  period,
  coverSrc: coverId
    ? IMG(coverId, 1000, 1250)
    : photos[0]?.src ?? IMG("1519741497674-611481863552", 1000, 1250),
  photos,
  videos,
});

// ------------------------------------------------------------------ PORTRAIT
const portrait: Category = {
  slug: "portrait",
  num: "01",
  title: "Portrait",
  unit: "photos",
  subtitle: "Visages & lumière naturelle",
  description:
    "Visages, silences et lumière naturelle — en studio ou dehors, sans jamais forcer la pose.",
  location: "Bruxelles & ailleurs",
  period: "2024 — 2026",
  coverSrc: IMG("1544005313-94ddf0286df2", 1000, 1333),
  series: [
    mkSeries(
      "nora-soie",
      "Nora — série soie",
      "Série studio — soie, contre-jour, silence.",
      "Studio, Bruxelles",
      "2026",
      [
        ph("1544005313-94ddf0286df2", 900, 1200, "3 / 4", "Nora — série soie", "Studio, 2026"),
        ph("1531123897727-8f129e1688ce", 960, 1200, "4 / 5", "Peau & argent", "Studio, 2024"),
        ph("1547425260-76bcadfb4f2c", 900, 1200, "3 / 4", "Regard II", "Studio, 2026"),
        ph("1552058544-f2b08422138a", 900, 1200, "3 / 4", "Antoine, l’hiver", "Studio, 2024"),
      ],
      [vd("youtube", "ScMzIvxBSi4", "Making-of — série soie", "Studio, 2026", "01:12")],
      "1544005313-94ddf0286df2",
    ),
    mkSeries(
      "visages",
      "Visages",
      "Portraits sur le vif, à la lumière du jour.",
      "Bruxelles & ailleurs",
      "2024 — 2026",
      [
        ph("1494790108377-be9c29b29330", 900, 1200, "3 / 4", "Léa — fin d’après-midi", "Ixelles, 2026"),
        ph("1507003211169-0a1dd7228f2d", 960, 1200, "4 / 5", "Amine, deux fois", "Studio, 2025"),
        ph("1506794778202-cad84cf45f1d", 1000, 1000, "1 / 1", "Le peintre", "Saint-Gilles, 2025"),
        ph("1517841905240-472988babdf9", 900, 1200, "3 / 4", "Anna, midi juste", "Anvers, 2025"),
        ph("1508214751196-bcfd4ca60f91", 960, 1200, "4 / 5", "Contre-jour n°3", "Ostende, 2024"),
        ph("1516627145497-ae6968895b74", 800, 1200, "2 / 3", "Le petit dernier", "Uccle, 2026"),
        ph("1531746020798-e6953c6e8e04", 900, 1200, "3 / 4", "La luthière", "Atelier, 2025"),
        ph("1554151228-14d9def656e4", 1000, 1000, "1 / 1", "Marguerite", "Liège, 2025"),
      ],
      [],
      "1494790108377-be9c29b29330",
    ),
  ],
};

// ------------------------------------------------------------------- MARIAGE
const mariage: Category = {
  slug: "mariage",
  num: "02",
  title: "Mariage",
  unit: "photos",
  subtitle: "Des journées entières, sans poser",
  description:
    "Des journées entières racontées sans poser — des préparatifs au dernier verre.",
  location: "Belgique & voisins",
  period: "2024 — 2026",
  coverSrc: IMG("1529636798458-92182e662485", 1000, 1250),
  series: [
    mkSeries(
      "salome-jan",
      "Salomé & Jan",
      "Une journée entière, une averse parfaite.",
      "Gand",
      "2026",
      [
        ph("1519741497674-611481863552", 1200, 800, "3 / 2", "Les préparatifs — Salomé", "Gand, 2026"),
        ph("1529636798458-92182e662485", 1200, 800, "3 / 2", "Première danse", "Modave, 2025"),
        ph("1511578314322-379afb476865", 1200, 800, "3 / 2", "Le bal ouvert", "Gand, 2026"),
        ph("1515934751635-c81c6bc9a2d8", 1200, 800, "3 / 2", "Bal — une heure du matin", "Gand, 2026"),
        ph("1470337458703-46ad1756a187", 1200, 800, "3 / 2", "Dernier verre", "Gand, 2026"),
      ],
      [vd("vimeo", "76979871", "Salomé & Jan — le film", "Gand, 2026", "04:12")],
      "1529636798458-92182e662485",
    ),
    mkSeries(
      "ceremonies",
      "Cérémonies",
      "Du oui aux adieux à l’aube.",
      "Belgique & voisins",
      "2024 — 2026",
      [
        ph("1606800052052-a08af7148866", 900, 1200, "3 / 4", "Le oui", "Bruges, 2026"),
        ph("1465495976277-4387d4b0b4c6", 960, 1200, "4 / 5", "Les mains", "Bruxelles, 2025"),
        ph("1428592953211-077101b2021b", 1200, 800, "3 / 2", "Cortège sous la pluie", "Namur, 2024"),
        ph("1520854221256-17451cc331bf", 800, 1200, "2 / 3", "Les demoiselles", "Modave, 2025"),
        ph("1511285560929-80b456fea0bc", 900, 1200, "3 / 4", "Sortie d’église", "Bruges, 2026"),
        ph("1469371670807-013ccf25f16a", 1200, 800, "3 / 2", "La table d’honneur", "Modave, 2025"),
        ph("1464366400600-7168b8af9bc3", 800, 1200, "2 / 3", "La cérémonie", "Knokke, 2024"),
        ph("1605100804763-247f67b3557e", 1000, 1000, "1 / 1", "L’alliance", "Bruxelles, 2025"),
        ph("1519225421980-715cb0215aed", 1200, 800, "3 / 2", "Adieux à l’aube", "Namur, 2024"),
      ],
      [],
      "1606800052052-a08af7148866",
    ),
  ],
};

// ---------------------------------------------------------------------- MODE
const mode: Category = {
  slug: "mode",
  num: "03",
  title: "Mode",
  unit: "photos",
  subtitle: "Éditoriaux, lookbooks, backstage",
  description:
    "Éditoriaux, lookbooks et backstage — flash direct, grain fin, gestes francs.",
  location: "Bruxelles · Anvers",
  period: "2024 — 2026",
  coverSrc: IMG("1509631179647-0177331693ae", 1000, 1333),
  series: [
    mkSeries(
      "beton",
      "Série « Béton »",
      "Flash direct, béton brut, silhouettes nettes.",
      "Tour & Taxis, Bruxelles",
      "2026",
      [
        ph("1509631179647-0177331693ae", 900, 1200, "3 / 4", "Série « Béton » — look 04", "Tour & Taxis, 2026"),
        ph("1496747611176-843222e1e57c", 900, 1200, "3 / 4", "Soie & halogène", "Studio, 2026"),
        ph("1487222477894-8943e31ef7b2", 900, 1200, "3 / 4", "Série « Béton » — look 09", "Tour & Taxis, 2026"),
      ],
      [vd("youtube", "LXb3EKWsInQ", "« Béton » — le fashion film", "Bruxelles, 2026", "02:31")],
      "1509631179647-0177331693ae",
    ),
    mkSeries(
      "lookbook-backstage",
      "Lookbook & backstage",
      "L’envers du podium, AW25.",
      "Bruxelles · Anvers",
      "2024 — 2025",
      [
        ph("1515886657613-9f3515b0c78f", 800, 1200, "2 / 3", "Backstage — MAD", "Bruxelles, 2025"),
        ph("1524504388940-b1c1722653e1", 960, 1200, "4 / 5", "Lookbook AW25 — 02", "Anvers, 2025"),
        ph("1529139574466-a303027c1d8b", 900, 1200, "3 / 4", "Rouge sur gris", "Charleroi, 2024"),
        ph("1483985988355-763728e1935b", 800, 1200, "2 / 3", "Casting sauvage", "Bruxelles, 2026"),
        ph("1469334031218-e382a71b716b", 900, 1200, "3 / 4", "Le manteau", "Ostende, 2025"),
        ph("1485968579580-b6d095142e6e", 960, 1200, "4 / 5", "Flash direct — 23h", "Studio, 2025"),
        ph("1490481651871-ab68de25d43d", 800, 1200, "2 / 3", "Nuit américaine", "Liège, 2024"),
      ],
      [],
      "1524504388940-b1c1722653e1",
    ),
  ],
};

// -------------------------------------------------------------------- GAMING
const gaming: Category = {
  slug: "gaming",
  num: "04",
  title: "Gaming",
  unit: "photos",
  subtitle: "Setups, LAN, portraits de joueurs",
  description:
    "Setups, LAN, portraits de joueurs — néon, écrans et concentration.",
  location: "Charleroi · Gand",
  period: "2024 — 2026",
  coverSrc: IMG("1542751371-adc38448a05e", 1000, 1333),
  series: [
    mkSeries(
      "lan-charleroi",
      "LAN de Charleroi",
      "Trois nuits de finale, néon et sueur froide.",
      "Charleroi",
      "2025",
      [
        ph("1542751371-adc38448a05e", 1200, 800, "3 / 2", "LAN de Charleroi — la finale", "Charleroi, 2025"),
        ph("1560253023-3ec5d502959f", 1200, 800, "3 / 2", "Le setup de Max", "Charleroi, 2025"),
        ph("1598550476439-6847785fcea6", 1200, 800, "3 / 2", "La tour, minuit", "Charleroi, 2025"),
      ],
      [vd("youtube", "aqz-KE-bpKQ", "Aftermovie — LAN de Charleroi", "Charleroi, 2025", "01:48")],
      "1542751371-adc38448a05e",
    ),
    mkSeries(
      "setups",
      "Setups & portraits",
      "Néon, écrans et concentration.",
      "Charleroi · Gand",
      "2024 — 2026",
      [
        ph("1593305841991-05c297ba4575", 1280, 720, "16 / 9", "Setup — 02h14", "Bruxelles, 2026"),
        ph("1552820728-8b83bb6b773f", 960, 1200, "4 / 5", "La manette", "Studio, 2025"),
        ph("1511512578047-dfb367046420", 1280, 720, "16 / 9", "Néon rose, écran bleu", "Gand, 2026"),
        ph("1612287230202-1ff1d85d1bdf", 900, 1200, "3 / 4", "Clavier — macro", "Bruxelles, 2024"),
        ph("1511882150382-421056c89033", 1200, 800, "3 / 2", "Insert coin", "Bruxelles, 2026"),
        ph("1550745165-9bc0b252726f", 1280, 720, "16 / 9", "Rétro — Game Boy", "Charleroi, 2025"),
        ph("1593118247619-e2d6f056869e", 1280, 720, "16 / 9", "Victoire royale", "Gand, 2026"),
      ],
      [],
      "1593305841991-05c297ba4575",
    ),
  ],
};

// --------------------------------------------------------------------- VIDÉO
const video: Category = {
  slug: "video",
  num: "05",
  title: "Vidéo",
  unit: "films",
  subtitle: "Les mêmes histoires, en mouvement",
  description:
    "Films de mariage, aftermovies et clips — les mêmes histoires, en mouvement.",
  location: "Belgique",
  period: "2024 — 2026",
  coverSrc: IMG("1492691527719-9d1e07e534b4", 1000, 1250),
  series: [
    mkSeries(
      "films-mariage",
      "Films de mariage",
      "La journée, condensée et remontée.",
      "Belgique",
      "2026",
      [],
      [
        vd("vimeo", "76979871", "Salomé & Jan — film de mariage", "Gand, 2026", "04:12"),
        vd("youtube", "LXb3EKWsInQ", "Elise & Marco — teaser", "Namur, 2026", "00:58"),
      ],
      "1519741497674-611481863552",
    ),
    mkSeries(
      "aftermovies-clips",
      "Aftermovies & clips",
      "Événements, clips et showreel.",
      "Belgique",
      "2024 — 2026",
      [],
      [
        vd("youtube", "aqz-KE-bpKQ", "Aftermovie — LAN de Charleroi", "Charleroi, 2025", "01:48"),
        vd("youtube", "ScMzIvxBSi4", "« Béton » — fashion film", "Bruxelles, 2026", "02:31"),
        vd("vimeo", "22439234", "Clip — Rue des Brumes", "Liège, 2025", "03:05"),
        vd("youtube", "LXb3EKWsInQ", "Showreel 2026", "Studio, 2026", "01:30"),
      ],
      "1536240478700-b869070f9279",
    ),
  ],
};

export const CATEGORIES: Category[] = [
  portrait,
  mariage,
  mode,
  gaming,
  video,
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSeries(
  catSlug: string,
  seriesSlug: string,
): { category: Category; series: Series } | undefined {
  const category = getCategory(catSlug);
  const series = category?.series.find((s) => s.slug === seriesSlug);
  if (category && series) return { category, series };
  return undefined;
}
