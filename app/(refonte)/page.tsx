import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { ProofBand } from "@/components/jk/ProofBand";
import { Parallax } from "@/components/jk/Parallax";
import { CategoryRow } from "@/components/jk/CategoryRow";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Accueil",
};

/* Accueil de la refonte (Lot 5).
 *
 * Route SÉPARÉE de `/` : le site est en production et le §2 impose que les
 * nouvelles routes coexistent avec les anciennes jusqu'à la bascule finale.
 * L'accueil actuel reste donc servi sur `/` ; celui-ci est relisible à côté.
 * À la bascule, son contenu prendra la place de `/`.
 *
 * Aucun texte de contenu n'est écrit en dur ici : titres, libellés, faits du
 * colophon et clients du bandeau viennent de `site_content`, et les comptes de
 * photos sont calculés depuis les données (§12). */

export default async function AccueilRefontePage() {
  const [cats, content] = await Promise.all([getCategories(), getSiteContent()]);

  // Photo du hero : première photo de la première série publiée. Aucune image
  // n'est codée en dur — si le portfolio est vide, le hero reste sur son fond.
  const allPhotos = cats.flatMap((c) => c.series.flatMap((s) => s.photos));
  const heroPhoto = allPhotos[0];

  // Portrait du studio : celui saisi en admin s'il existe, sinon une autre
  // photo du portfolio — jamais la même que le hero, pour ne pas la répéter.
  const studioPortrait = content.about.portraitPath
    ? {
        src: publicImageUrl(content.about.portraitPath),
        alt: content.about.portraitCaption || content.about.title,
        blur: "",
      }
    : allPhotos[1]
      ? {
          src: allPhotos[1].src,
          alt: allPhotos[1].alt,
          blur: allPhotos[1].blurDataURL,
        }
      : null;

  // « Sélection » : une vignette par série, dans l'ordre des catégories.
  const selection = cats
    .flatMap((c) => c.series.map((s) => ({ cat: c, serie: s })))
    .slice(0, 6);

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- hero plein écran ---- */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          background: "var(--jk-surface)",
          overflow: "hidden",
        }}
      >
        {heroPhoto && (
          <Parallax>
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              sizes="100vw"
              priority
              placeholder={heroPhoto.blurDataURL ? "blur" : "empty"}
              blurDataURL={heroPhoto.blurDataURL || undefined}
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
              subject={heroPhoto?.subject}
              location={heroPhoto?.place}
              variant="hero"
              tone="onImage"
            />
          </Reveal>
        </div>
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

      {/* ---- (01) le studio ---- */}
      {/* Deux colonnes comme la maquette : texte à gauche, portrait à droite.
          La largeur fixe de 520px de la maquette devient un minmax pour ne pas
          casser sous 1440px. */}
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
            <span style={{ color: "var(--jk-brass)" }}>(01)</span>
            {content.home.studioTitle}
          </span>

          {/* Intro courte — 2 à 3 phrases (§8). */}
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

          {/* Colophon : <dl> sémantique, pas une liste à puces (§8). */}
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

        {/* Portrait du studio — colonne droite de la maquette (720px de haut,
            zoom 1.04 au survol). Pris dans le portfolio réel si aucun portrait
            n'est renseigné, plutôt qu'une image importée. */}
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

      {/* ---- preuve sociale (masquée tant qu'elle n'est pas activée) ---- */}
      {content.proof.enabled && (
        <ProofBand
          label={content.proof.label}
          clients={content.proof.clients}
        />
      )}

      {/* ---- (02) sélection ---- */}
      {selection.length > 0 && (
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
              <span style={{ color: "var(--jk-brass)" }}>(02)</span>
              {content.home.selectionTitle}
            </span>
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
                  {/* Décalage plafonné : au-delà de 6 vignettes l'attente
                      deviendrait perceptible et la page paraîtrait lente. */}
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
                      {/* Légende éditoriale de la vignette (§8). Se dégrade
                          en silence si la photo n'est pas encore légendée. */}
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
      )}

      {/* ---- (03) catégories ---- */}
      <section
        style={{
          padding: "var(--jk-gap-section) var(--jk-gap-page)",
          display: "grid",
          gap: 40,
        }}
      >
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
          <span style={{ color: "var(--jk-brass)" }}>(03)</span>
          {content.home.categoriesTitle}
        </span>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {cats.map((c, i) => {
            // Compte calculé depuis les données, jamais écrit en dur (§12).
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
    </main>
  );
}
