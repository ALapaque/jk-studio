import { HeroCard } from "./HeroCard";
import type { HeroItem } from "@/lib/data";

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&h=${h}&fit=crop&auto=format`;
const pad = (n: number) => String(n).padStart(2, "0");

type Size = "big" | "small" | "tiny";
interface Slot {
  size: Size;
  className?: string;
  position: React.CSSProperties;
  para: { mx: number; sy: number; r3d: string };
  aspect: string;
  demo: { src: string; label: string; href: string; tag: string; tagRight?: string };
}

// Emplacements fixes des cartes flottantes (position, taille, parallaxe) +
// contenu de démonstration utilisé tant qu'aucune photo n'est « à la une ».
const SLOTS: Slot[] = [
  {
    size: "big",
    position: { right: "6%", top: "12%", width: "clamp(150px,19vw,320px)", zIndex: 3 },
    para: { mx: 22, sy: 0.07, r3d: "4,-7,2.5" },
    aspect: "16 / 11",
    demo: { src: IMG("1515934751635-c81c6bc9a2d8", 900, 620), label: "Mariage", href: "/travaux/mariage", tag: "MARIAGE — 02", tagRight: "GAND" },
  },
  {
    size: "big",
    position: { left: "9%", bottom: "14%", width: "clamp(170px,21vw,360px)", zIndex: 3 },
    para: { mx: 18, sy: 0.09, r3d: "-3.5,6,-2.5" },
    aspect: "16 / 10",
    demo: { src: IMG("1511512578047-dfb367046420", 1000, 640), label: "Gaming", href: "/travaux/gaming", tag: "GAMING — 04", tagRight: "GAND" },
  },
  {
    size: "small",
    className: "hero-3",
    position: { left: "5%", top: "15%", width: "clamp(110px,14vw,230px)", zIndex: 1, opacity: 0.9 },
    para: { mx: 9, sy: -0.04, r3d: "3,8,-5" },
    aspect: "3 / 4",
    demo: { src: IMG("1508214751196-bcfd4ca60f91", 600, 800), label: "Portrait", href: "/travaux/portrait", tag: "PORTRAIT — 01" },
  },
  {
    size: "small",
    className: "hero-4",
    position: { right: "13%", bottom: "13%", width: "clamp(96px,12vw,200px)", zIndex: 1, opacity: 0.9 },
    para: { mx: 12, sy: -0.06, r3d: "2.5,-8,4" },
    aspect: "3 / 4",
    demo: { src: IMG("1509631179647-0177331693ae", 520, 760), label: "Mode", href: "/travaux/mode", tag: "MODE — 03" },
  },
  {
    size: "tiny",
    className: "hero-5",
    position: { left: "21%", top: "7%", width: "clamp(88px,10vw,180px)", zIndex: 1, opacity: 0.92 },
    para: { mx: 10, sy: -0.05, r3d: "3,-6,3" },
    aspect: "4 / 5",
    demo: { src: IMG("1524504388940-b1c1722653e1", 520, 650), label: "Mode", href: "/travaux/mode", tag: "MODE — 05" },
  },
  {
    size: "tiny",
    className: "hero-6",
    position: { right: "23%", bottom: "8%", width: "clamp(90px,10.5vw,190px)", zIndex: 1, opacity: 0.92 },
    para: { mx: 13, sy: 0.05, r3d: "-3,6,-3" },
    aspect: "3 / 4",
    demo: { src: IMG("1517841905240-472988babdf9", 520, 690), label: "Portrait", href: "/travaux/portrait", tag: "PORTRAIT — 06" },
  },
  {
    size: "tiny",
    className: "hero-7",
    position: { left: "1.5%", top: "45%", width: "clamp(96px,11vw,196px)", zIndex: 1, opacity: 0.9 },
    para: { mx: 8, sy: -0.04, r3d: "-2.5,7,-4" },
    aspect: "16 / 10",
    demo: { src: IMG("1492691527719-9d1e07e534b4", 560, 350), label: "Vidéo", href: "/travaux/video", tag: "VIDÉO — 07" },
  },
  {
    size: "tiny",
    className: "hero-8",
    position: { right: "2%", top: "42%", width: "clamp(96px,11vw,196px)", zIndex: 1, opacity: 0.9 },
    para: { mx: 8, sy: 0.04, r3d: "3,-7,3" },
    aspect: "3 / 2",
    demo: { src: IMG("1519741497674-611481863552", 560, 373), label: "Mariage", href: "/travaux/mariage", tag: "MARIAGE — 08" },
  },
];

/** Cartes flottantes du hero. Utilise les photos « à la une » si présentes,
 *  sinon le contenu de démonstration (jamais vide). */
export function HeroCards({ items }: { items: HeroItem[] }) {
  // Chaque emplacement utilise une photo « à la une » si disponible, sinon il
  // retombe sur son contenu de démonstration. Ainsi le hero reste toujours
  // complet : une donnée manquante ou partielle ne vide jamais toute la section.
  return (
    <>
      {SLOTS.map((slot, i) => {
        const it = items[i];
        const src = it?.src || slot.demo.src;
        const label = it?.label || slot.demo.label;
        const href = it?.href || slot.demo.href;
        const tag = it?.label
          ? `${it.label.toUpperCase()} — ${pad(i + 1)}`
          : slot.demo.tag;
        const tagRight = it ? undefined : slot.demo.tagRight;
        return (
          <HeroCard
            key={i}
            href={href}
            label={label}
            size={slot.size}
            className={slot.className}
            position={slot.position}
            para={slot.para}
            aspect={slot.aspect}
            img={{ src, alt: `Aperçu — ${label}` }}
            tag={tag}
            tagRight={tagRight}
          />
        );
      })}
    </>
  );
}
