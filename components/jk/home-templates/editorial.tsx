import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { ProofBand } from "@/components/jk/ProofBand";
import { CategoryRow } from "@/components/jk/CategoryRow";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Accueil « editorial » — le portfolio d'abord.
 *
 * Hero réduit à une bande titrée (on y affiche enfin l'accroche et le grand
 * titre du hero, ignorés par `classic`), puis les catégories mises en avant en
 * tête, le studio ensuite, la sélection en pied. Lecture de magazine : on entre
 * par le sommaire des univers plutôt que par une image plein écran. */

export function HomeEditorial({ cats, content }: HomeTemplateProps) {
  const { heroSlides, hero, selection } = deriveHomeData(cats, content);
  const cover = heroSlides[0]?.src || hero?.src || "";
  const title = content.hero.titleLines?.filter(Boolean) ?? [];

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- bande titrée ---- */}
      <section
        style={{
          position: "relative",
          height: "clamp(420px, 66vh, 680px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {cover && (
          <Parallax>
            <Image
              src={cover}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        )}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(14,12,10,.5) 0%, rgba(14,12,10,.08) 40%, rgba(14,12,10,.82) 100%)",
          }}
        />
        <Reveal
          as="div"
          style={{
            position: "relative",
            padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 76px)",
            display: "grid",
            gap: 18,
            color: "#efe9e1",
            maxWidth: 1100,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-brass)",
            }}
          >
            {content.hero.eyebrow}
          </span>
          {title.length > 0 && (
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontWeight: 400,
                fontSize: "clamp(44px, 8vw, 104px)",
                lineHeight: 0.96,
                letterSpacing: "var(--jk-ls-display)",
              }}
            >
              {title.map((l, i) => (
                <span key={i} style={{ display: "block" }}>
                  {l}
                </span>
              ))}
            </h1>
          )}
          {content.hero.categoriesLine && (
            <span
              style={{
                fontSize: 10,
                letterSpacing: "var(--jk-track-place)",
                textTransform: "uppercase",
                color: "rgba(239,233,225,.72)",
              }}
            >
              {content.hero.categoriesLine}
            </span>
          )}
        </Reveal>
      </section>

      {/* ---- (01) catégories, en avant ---- */}
      <section
        style={{
          padding: "var(--jk-gap-section) var(--jk-gap-page) 0",
          display: "grid",
          gap: 40,
        }}
      >
        <SectionEyebrow num="01">{content.home.categoriesTitle}</SectionEyebrow>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {cats.map((c, i) => {
            const n =
              c.series.reduce((acc, s) => acc + s.photos.length, 0) +
              (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
            return (
              <CategoryRow
                key={c.slug}
                href={`/travaux/${c.slug}`}
                num={c.num}
                title={c.title}
                count={`${n} ${c.unit}`}
                coverSrc={c.coverSrc}
                last={i === cats.length - 1}
                delay={Math.min(i, 5) * 80}
              />
            );
          })}
        </ul>
      </section>

      {/* ---- (02) le studio ---- */}
      <section
        style={{
          padding: "var(--jk-gap-section) var(--jk-gap-page)",
          display: "grid",
          gap: 32,
          maxWidth: "60ch",
        }}
      >
        <SectionEyebrow num="02">{content.home.studioTitle}</SectionEyebrow>
        <Reveal as="div">
          <p
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              lineHeight: 1.32,
              letterSpacing: "var(--jk-ls-tight)",
              textWrap: "pretty",
            }}
          >
            {content.studio.lead}
          </p>
        </Reveal>
      </section>

      {content.proof.enabled && (
        <ProofBand label={content.proof.label} clients={content.proof.clients} />
      )}

      {/* ---- (03) sélection ---- */}
      {selection.length > 0 && (
        <section
          style={{
            padding: "var(--jk-gap-section) var(--jk-gap-page)",
            display: "grid",
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <SectionEyebrow num="03">{content.home.selectionTitle}</SectionEyebrow>
            <Link
              href="/travaux"
              style={{
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--jk-ink-mute)",
                borderBottom: "1px solid var(--jk-brass)",
                paddingBottom: 3,
              }}
            >
              {content.home.categoriesLink}
            </Link>
          </div>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "48px var(--jk-gap-grid)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {selection.slice(0, 8).map(({ cat, serie }, i) => {
              const photo = serie.photos[0];
              return (
                <li key={`${cat.slug}/${serie.slug}`}>
                  <Reveal as="div" delay={Math.min(i, 5) * 70}>
                    <Link
                      href={`/travaux/${cat.slug}/${serie.slug}`}
                      data-jk-label={serie.title}
                      style={{ display: "grid", gap: 14, color: "inherit" }}
                    >
                      <span
                        style={{
                          position: "relative",
                          display: "block",
                          height: 340,
                          overflow: "hidden",
                          background: "var(--jk-surface)",
                        }}
                      >
                        {(serie.coverSrc || photo) && (
                          <Image
                            src={serie.coverSrc || photo.src}
                            alt={photo?.alt ?? serie.title}
                            fill
                            sizes="(max-width: 760px) 100vw, 25vw"
                            className="jk-zoom"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </span>
                      <Caption
                        subject={photo?.subject || serie.title}
                        location={photo?.place || cat.title}
                        variant="thumbnail"
                      />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}

function SectionEyebrow({
  num,
  children,
}: {
  num: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 14,
        fontSize: 10,
        letterSpacing: "var(--jk-track-label)",
        textTransform: "uppercase",
        color: "var(--jk-ink-mute)",
      }}
    >
      <span style={{ color: "var(--jk-brass)" }}>({num})</span>
      {children}
    </span>
  );
}
