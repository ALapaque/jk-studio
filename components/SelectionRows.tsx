import Image from "next/image";
import type { SelectionItem } from "@/lib/data";
import { TransitionLink } from "./motion/TransitionLink";

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&h=${h}&fit=crop&auto=format`;

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 9.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--ink2)",
};
const serifTitle: React.CSSProperties = {
  fontFamily: "var(--font-serif), serif",
  fontSize: "clamp(26px,2.6vw,38px)",
  color: "var(--ink)",
  marginTop: 10,
};
const desc: React.CSSProperties = {
  margin: "12px 0 20px",
  fontFamily: "var(--font-serif), serif",
  fontStyle: "italic",
  fontSize: 17.5,
  lineHeight: 1.4,
  color: "var(--body)",
};
const cta: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 10,
  letterSpacing: "0.16em",
  color: "var(--accent)",
};
const figStyle: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: 16,
  fontFamily: "var(--font-mono), monospace",
  fontSize: 9,
  letterSpacing: "0.12em",
  color: "#fff",
  mixBlendMode: "difference",
};

const DEMO: SelectionItem[] = [
  {
    title: "Salomé & Jan",
    description: "Une journée entière, une averse parfaite.",
    categoryTitle: "Mariage",
    period: "Gand, 2026",
    href: "/travaux/mariage/salome-jan",
    coverSrc: IMG("1529636798458-92182e662485", 1500, 1000),
  },
  {
    title: "Nora — série soie",
    description: "Série studio — soie, contre-jour, silence.",
    categoryTitle: "Portrait",
    period: "Studio, 2026",
    href: "/travaux/portrait/nora-soie",
    coverSrc: IMG("1544005313-94ddf0286df2", 1000, 1333),
  },
  {
    title: "LAN de Charleroi",
    description: "trois nuits de finale, néon et sueur froide.",
    categoryTitle: "Gaming",
    period: "2025",
    href: "/travaux/gaming/lan-charleroi",
    coverSrc: IMG("1542751371-adc38448a05e", 1600, 762),
  },
];

const label = (it: SelectionItem) =>
  it.period ? `${it.categoryTitle} — ${it.period}` : it.categoryTitle;

function Cover({
  it,
  aspect,
  sizes,
  sy,
  figNum,
}: {
  it: SelectionItem;
  aspect: string;
  sizes: string;
  sy: string;
  figNum: string;
}) {
  return (
    <span
      data-reveal="mask"
      style={{
        display: "block",
        position: "relative",
        aspectRatio: aspect,
        overflow: "hidden",
        background: "var(--bg2)",
        boxShadow: "0 0 110px var(--glow)",
      }}
    >
      {it.coverSrc && (
        <Image
          data-para="1"
          data-sy={sy}
          data-s="1.12"
          src={it.coverSrc}
          alt={it.title}
          fill
          sizes={sizes}
          style={{ objectFit: "cover", filter: "var(--pf)" }}
        />
      )}
      <span style={figStyle}>{figNum}</span>
    </span>
  );
}

/** Section « Sélection » de l'accueil, alimentée par les séries publiées
 *  (repli sur des exemples de démonstration si rien n'est publié). */
export function SelectionRows({ items }: { items: SelectionItem[] }) {
  const sel = items.length ? items : DEMO;
  const [a, b, c] = sel;

  return (
    <>
      {/* Row 1 — grande image gauche + texte droite */}
      {a && (
        <div className="grid12" style={{ alignItems: "end", marginBottom: "clamp(80px,10vw,150px)" }}>
          <TransitionLink href={a.href} transitionLabel={a.title} data-cursor="view" style={{ gridColumn: "1 / span 8", textAlign: "left" }}>
            <Cover it={a} aspect="3 / 2" sizes="(max-width:760px) 100vw, 66vw" sy="0.05" figNum="FIG. 01" />
          </TransitionLink>
          <div style={{ gridColumn: "9 / span 4", paddingBottom: 8 }}>
            <div data-reveal="rise" style={mono}>{label(a)}</div>
            <div data-reveal="rise" data-delay="60" style={serifTitle}>{a.title}</div>
            {a.description && (
              <p data-reveal="rise" data-delay="110" style={desc}>{a.description}</p>
            )}
            <TransitionLink href={a.href} transitionLabel={a.title} data-cursor="link" data-reveal="rise" data-delay="160" style={cta}>
              VOIR LA SÉRIE →
            </TransitionLink>
          </div>
        </div>
      )}

      {/* Row 2 — image droite (DOM-first) + texte gauche */}
      {b && (
        <div className="grid12" style={{ alignItems: "start", marginBottom: "clamp(80px,10vw,150px)" }}>
          <TransitionLink href={b.href} transitionLabel={b.title} data-cursor="view" style={{ gridColumn: "6 / span 5", textAlign: "left" }}>
            <Cover it={b} aspect="3 / 4" sizes="(max-width:760px) 100vw, 42vw" sy="0.06" figNum="FIG. 02" />
          </TransitionLink>
          <div style={{ gridColumn: "1 / span 4", paddingTop: "clamp(20px,4vw,70px)" }}>
            <div data-reveal="rise" style={mono}>{label(b)}</div>
            <div data-reveal="rise" data-delay="60" style={serifTitle}>{b.title}</div>
            {b.description && (
              <p data-reveal="rise" data-delay="110" style={desc}>{b.description}</p>
            )}
            <TransitionLink href={b.href} transitionLabel={b.title} data-cursor="link" data-reveal="rise" data-delay="160" style={cta}>
              VOIR LA SÉRIE →
            </TransitionLink>
          </div>
        </div>
      )}

      {/* Row 3 — grande image panoramique + légende dessous */}
      {c && (
        <div className="grid12">
          <TransitionLink href={c.href} transitionLabel={c.title} data-cursor="view" style={{ gridColumn: "2 / span 10", textAlign: "left" }}>
            <Cover it={c} aspect="21 / 10" sizes="83vw" sy="0.05" figNum="FIG. 03" />
            <span data-reveal="rise" style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(22px,2.2vw,32px)", color: "var(--ink)" }}>
                {c.title}
                {c.description && (
                  <em style={{ fontStyle: "italic", color: "var(--body)" }}> — {c.description}</em>
                )}
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink2)", textTransform: "uppercase" }}>
                {label(c)}
              </span>
            </span>
          </TransitionLink>
        </div>
      )}
    </>
  );
}
