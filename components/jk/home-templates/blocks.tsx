import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { ProofBand } from "@/components/jk/ProofBand";
import { HeroSlideshow } from "@/components/jk/HeroSlideshow";
import { CategoryRow } from "@/components/jk/CategoryRow";
import { SpreadGallery } from "@/components/jk/SpreadGallery";
import type { Category } from "@/lib/types";
import type { SiteContent } from "@/lib/content";
import type { HomeSection } from "@/lib/home-layout";
import { deriveHomeData } from "./shared";

/* Blocs de section de l'accueil, composés dans l'ordre par le template
 * « builder » (composeur). Chaque bloc est extrait des templates existants
 * (classic / margauxgatti) pour rester fidèle au rendu déjà validé. */

type HomeData = ReturnType<typeof deriveHomeData>;

export interface BlockProps {
  cats: Category[];
  content: SiteContent;
  data: HomeData;
  section: HomeSection;
}

const labelStyle = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: 14,
  fontSize: 10,
  letterSpacing: "var(--jk-track-label)",
  textTransform: "uppercase" as const,
  color: "var(--jk-ink-mute)",
};

/* ------------------------------------------------------------------ HERO */

function HeroFullscreen({ content, data }: BlockProps) {
  const { hero, heroSlides } = data;
  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        background: "var(--jk-surface)",
        overflow: "hidden",
      }}
    >
      {heroSlides.length > 0 ? (
        <HeroSlideshow slides={heroSlides} />
      ) : (
        <>
          {hero && (
            <Parallax>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                sizes="100vw"
                priority
                placeholder={hero.blurDataURL ? "blur" : "empty"}
                blurDataURL={hero.blurDataURL || undefined}
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
                "linear-gradient(to bottom, rgba(14,12,10,.62) 0%, rgba(14,12,10,0) 34%, rgba(14,12,10,0) 58%, rgba(14,12,10,.72) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "var(--jk-gap-page)",
              bottom: 52,
            }}
          >
            <Reveal>
              <Caption
                subject={hero?.subject}
                location={hero?.place}
                variant="hero"
                tone="onImage"
              />
            </Reveal>
          </div>
        </>
      )}
      <span
        style={{
          position: "absolute",
          right: "var(--jk-gap-page)",
          bottom: 52,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(239,233,225,.6)",
        }}
      >
        {content.hero.scrollHint}
        <span
          aria-hidden
          style={{ width: 52, height: 1, background: "var(--jk-brass)" }}
        />
      </span>
    </section>
  );
}

function HeroEditorial({ content, data }: BlockProps) {
  const { hero, heroSlides, studioPortrait } = data;
  const img = heroSlides[0]?.src
    ? { src: heroSlides[0].src, alt: heroSlides[0].caption || content.brand.name }
    : hero
      ? { src: hero.src, alt: hero.alt }
      : studioPortrait
        ? { src: studioPortrait.src, alt: studioPortrait.alt }
        : null;
  const tagline =
    content.hero.categoriesLine || content.hero.titleLines.join(" ");
  return (
    <section
      className="jk-studio-grid"
      style={{
        minHeight: "92svh",
        padding:
          "clamp(120px, 16vh, 200px) var(--jk-gap-page) var(--jk-gap-section)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 46%)",
        gap: "var(--jk-gap-col)",
        alignItems: "center",
      }}
    >
      <Reveal as="div" style={{ display: "grid", gap: "clamp(24px, 3vw, 40px)" }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "var(--jk-track-label)",
            textTransform: "uppercase",
            color: "var(--jk-brass)",
          }}
        >
          {content.hero.eyebrow}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(40px, 6.4vw, 88px)",
            lineHeight: 1.02,
            letterSpacing: "var(--jk-ls-display)",
            textWrap: "balance",
          }}
        >
          {tagline}
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            letterSpacing: "0.42em",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
          }}
        >
          {content.nav.portfolio || content.brand.name}
        </p>
      </Reveal>

      {img && (
        <Reveal
          as="div"
          style={{
            position: "relative",
            height: "clamp(440px, 74vh, 780px)",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          <Parallax amplitude={0.12}>
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 900px) 100vw, 46vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        </Reveal>
      )}
    </section>
  );
}

export function HeroBlock(props: BlockProps) {
  return props.section.fullscreen === false ? (
    <HeroEditorial {...props} />
  ) : (
    <HeroFullscreen {...props} />
  );
}

/* ------------------------------------------------------------------ INTRO */

function IntroStandard({ content, data }: BlockProps) {
  const { studioPortrait } = data;
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page)",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 520px)",
        gap: "var(--jk-gap-col)",
        alignItems: "start",
      }}
      className="jk-studio-grid"
    >
      <Reveal as="div" style={{ display: "grid", gap: 56 }}>
        <span style={labelStyle}>{content.home.studioTitle}</span>
        <p
          style={{
            margin: 0,
            maxWidth: "40ch",
            fontFamily: "var(--jk-serif)",
            fontSize: "clamp(24px, 3.4vw, 38px)",
            lineHeight: 1.32,
            letterSpacing: "var(--jk-ls-tight)",
            textWrap: "pretty",
          }}
        >
          {content.studio.lead}
        </p>
        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(0, 190px))",
            gap: 0,
            margin: 0,
            borderTop: "1px solid var(--jk-rule)",
          }}
        >
          {content.studio.facts.map((f, i) => (
            <div
              key={f.k}
              style={{
                padding: "18px 24px 0 0",
                borderRight:
                  i < content.studio.facts.length - 1
                    ? "1px solid var(--jk-rule)"
                    : undefined,
                paddingLeft: i > 0 ? 24 : 0,
              }}
            >
              <dt
                style={{
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--jk-ink-mute)",
                  marginBottom: 10,
                }}
              >
                {f.k}
              </dt>
              <dd style={{ margin: 0, fontSize: 14, letterSpacing: "0.06em" }}>
                {f.v}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {studioPortrait && (
        <Reveal
          as="div"
          style={{
            position: "relative",
            height: "clamp(420px, 62vh, 720px)",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          <Image
            src={studioPortrait.src}
            alt={studioPortrait.alt}
            fill
            sizes="(max-width: 900px) 100vw, 520px"
            className="jk-zoom"
            placeholder={studioPortrait.blur ? "blur" : "empty"}
            blurDataURL={studioPortrait.blur || undefined}
            style={{ objectFit: "cover" }}
          />
        </Reveal>
      )}
    </section>
  );
}

function IntroCentered({ content }: BlockProps) {
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page)",
        display: "grid",
        justifyItems: "center",
        textAlign: "center",
        gap: 28,
      }}
    >
      <Reveal as="div" style={{ display: "grid", justifyItems: "center", gap: 28 }}>
        <p
          style={{
            margin: 0,
            maxWidth: "34ch",
            fontFamily: "var(--jk-serif)",
            fontSize: "clamp(22px, 3vw, 34px)",
            lineHeight: 1.4,
            letterSpacing: "var(--jk-ls-tight)",
            textWrap: "pretty",
          }}
        >
          {content.studio.lead}
          <em style={{ color: "var(--jk-brass)" }}>{content.studio.leadEm}</em>
        </p>
        <p
          style={{
            margin: 0,
            maxWidth: "58ch",
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--jk-ink-mute)",
          }}
        >
          {content.studio.paragraph}
        </p>
      </Reveal>
    </section>
  );
}

export function IntroBlock(props: BlockProps) {
  return props.section.variant === "centered" ? (
    <IntroCentered {...props} />
  ) : (
    <IntroStandard {...props} />
  );
}

/* -------------------------------------------------------------- SELECTION */

function SelectionGrid({ content, data }: BlockProps) {
  const selection = data.selection.slice(0, 6);
  if (!selection.length) return null;
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page) 0",
        display: "grid",
        gap: 48,
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
        <span style={labelStyle}>{content.home.selectionTitle}</span>
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
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "56px var(--jk-gap-grid)",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {selection.map(({ cat, serie }, i) => {
          const photo = serie.photos[0];
          return (
            <li key={`${cat.slug}/${serie.slug}`}>
              <Reveal as="div" delay={Math.min(i, 5) * 80}>
                <Link
                  href={`/travaux/${cat.slug}/${serie.slug}`}
                  data-jk-label={serie.title}
                  style={{ display: "grid", gap: 16, color: "inherit" }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "block",
                      height: 460,
                      overflow: "hidden",
                      background: "var(--jk-surface)",
                    }}
                  >
                    {(serie.coverSrc || photo) && (
                      <Image
                        src={serie.coverSrc || photo.src}
                        alt={photo?.alt ?? serie.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="jk-zoom"
                        placeholder={photo?.blurDataURL ? "blur" : "empty"}
                        blurDataURL={photo?.blurDataURL || undefined}
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </span>
                  <Caption
                    subject={photo?.subject}
                    location={photo?.place}
                    variant="thumbnail"
                  />
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SelectionStories({ content, data }: BlockProps) {
  const stories = data.selection.slice(0, 3);
  if (!stories.length) return null;
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page)",
        display: "grid",
        gap: 44,
      }}
    >
      <Reveal as="div" style={{ textAlign: "center" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(26px, 3.6vw, 44px)",
            letterSpacing: "var(--jk-ls-tight)",
          }}
        >
          {content.home.selectionTitle}
        </h2>
      </Reveal>

      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "48px var(--jk-gap-grid)",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {stories.map(({ cat, serie }, i) => {
          const photo = serie.photos[0];
          const src = serie.coverSrc || photo?.src;
          return (
            <li key={`${cat.slug}/${serie.slug}`}>
              <Reveal as="div" delay={Math.min(i, 3) * 90}>
                <Link
                  href={`/travaux/${cat.slug}/${serie.slug}`}
                  data-jk-label={serie.title}
                  style={{ display: "grid", gap: 18, color: "inherit" }}
                >
                  <span
                    style={{
                      position: "relative",
                      display: "block",
                      height: 380,
                      overflow: "hidden",
                      background: "var(--jk-surface)",
                    }}
                  >
                    {src && (
                      <Image
                        src={src}
                        alt={photo?.alt ?? serie.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="jk-zoom"
                        style={{ objectFit: "cover" }}
                      />
                    )}
                  </span>
                  <span style={{ display: "grid", gap: 6, textAlign: "center" }}>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "var(--jk-ink-mute)",
                      }}
                    >
                      {cat.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--jk-serif)",
                        fontSize: 22,
                        letterSpacing: "var(--jk-ls-tight)",
                      }}
                    >
                      {serie.title}
                    </span>
                  </span>
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SelectionSpread({ content, data }: BlockProps) {
  const items = data.selection
    .map(({ cat, serie }) => ({
      src: serie.coverSrc || serie.photos[0]?.src || "",
      caption: `${serie.title} — ${cat.title}`,
      alt: serie.title,
    }))
    .filter((it) => it.src);
  if (!items.length) return null;
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page)",
        display: "grid",
        gap: 48,
      }}
    >
      <Reveal as="div">
        <span style={labelStyle}>{content.home.selectionTitle}</span>
      </Reveal>
      <SpreadGallery items={items} />
    </section>
  );
}

export function SelectionBlock(props: BlockProps) {
  if (props.section.variant === "stories") return <SelectionStories {...props} />;
  if (props.section.variant === "spread") return <SelectionSpread {...props} />;
  return <SelectionGrid {...props} />;
}

/* ------------------------------------------------------------- CATEGORIES */

function categoryPhotoCount(c: Category) {
  return (
    c.series.reduce((acc, s) => acc + s.photos.length, 0) +
    (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0)
  );
}

function CategoriesRows({ cats, content }: BlockProps) {
  if (!cats.length) return null;
  return (
    <section
      style={{
        padding: "var(--jk-gap-section) var(--jk-gap-page)",
        display: "grid",
        gap: 40,
      }}
    >
      <span style={labelStyle}>{content.home.categoriesTitle}</span>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {cats.map((c, i) => (
          <CategoryRow
            key={c.slug}
            href={`/travaux/${c.slug}`}
            num={c.num}
            title={c.title}
            count={`${categoryPhotoCount(c)} ${c.unit}`}
            coverSrc={c.coverSrc}
            last={i === cats.length - 1}
            delay={Math.min(i, 5) * 80}
          />
        ))}
      </ul>
    </section>
  );
}

function CategoriesAlternating({ cats, content }: BlockProps) {
  if (!cats.length) return null;
  return (
    <>
      {cats.map((c, i) => {
        const n = categoryPhotoCount(c);
        const imageLeft = i % 2 === 0;
        return (
          <section
            key={c.slug}
            className="jk-split-row"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              alignItems: "center",
              gap: "var(--jk-gap-col)",
              padding: "0 var(--jk-gap-page) var(--jk-gap-section)",
            }}
          >
            <Reveal
              as="div"
              style={{
                position: "relative",
                height: "clamp(380px, 60vh, 660px)",
                overflow: "hidden",
                background: "var(--jk-surface)",
                order: imageLeft ? 0 : 1,
              }}
            >
              {c.coverSrc && (
                <Parallax amplitude={0.1}>
                  <Image
                    src={c.coverSrc}
                    alt={c.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </Parallax>
              )}
            </Reveal>

            <Reveal
              as="div"
              style={{
                display: "grid",
                gap: 24,
                justifyItems: "start",
                padding: "0 clamp(0px, 3vw, 48px)",
                order: imageLeft ? 1 : 0,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "var(--jk-track-label)",
                  textTransform: "uppercase",
                  color: "var(--jk-brass)",
                }}
              >
                {c.num} — {n} {c.unit}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--jk-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(30px, 4.4vw, 58px)",
                  lineHeight: 1.04,
                  letterSpacing: "var(--jk-ls-display)",
                }}
              >
                {c.title}
              </h2>
              {(c.subtitle || c.description) && (
                <p
                  style={{
                    margin: 0,
                    maxWidth: "42ch",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--jk-ink-mute)",
                  }}
                >
                  {c.subtitle || c.description}
                </p>
              )}
              <Link
                href={`/travaux/${c.slug}`}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--jk-ink)",
                  borderBottom: "1px solid var(--jk-brass)",
                  paddingBottom: 4,
                }}
              >
                {content.home.categoriesLink}
              </Link>
            </Reveal>
          </section>
        );
      })}
    </>
  );
}

export function CategoriesBlock(props: BlockProps) {
  return props.section.variant === "alternating" ? (
    <CategoriesAlternating {...props} />
  ) : (
    <CategoriesRows {...props} />
  );
}

/* ------------------------------------------------------------------ PROOF */

export function ProofBlock({ content }: BlockProps) {
  if (!content.proof.enabled) return null;
  return (
    <ProofBand label={content.proof.label} clients={content.proof.clients} />
  );
}

/* --------------------------------------------------------------- RESOLVER */

export function renderHomeSection(props: BlockProps) {
  switch (props.section.type) {
    case "hero":
      return <HeroBlock {...props} />;
    case "intro":
      return <IntroBlock {...props} />;
    case "selection":
      return <SelectionBlock {...props} />;
    case "categories":
      return <CategoriesBlock {...props} />;
    case "proof":
      return <ProofBlock {...props} />;
    default:
      return null;
  }
}
