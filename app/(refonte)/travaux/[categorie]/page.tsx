import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/data";
import { IndexRow } from "@/components/jk/IndexRow";

export const revalidate = 60;

/* Page catégorie (refonte) : les séries d'un univers, en liste éditoriale.
 *
 * Construite à la bascule finale — la refonte n'avait jusque-là qu'un index
 * global (/travaux) et le défilé de série, mais pas de vue par catégorie, vers
 * laquelle pointent pourtant les lignes « (03) Catégories » de l'accueil. */

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const cat = await getCategoryBySlug(categorie);
  if (!cat) return { title: "Catégorie" };
  return { title: cat.title, description: cat.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const cat = await getCategoryBySlug(categorie);
  if (!cat) notFound();

  const n =
    cat.series.reduce((acc, s) => acc + s.photos.length, 0) +
    (cat.directMedia?.filter((m) => m.kind === "photo").length ?? 0);

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 48,
        }}
      >
        <div style={{ display: "grid", gap: 18 }}>
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
            <span style={{ color: "var(--jk-brass)" }}>({cat.num})</span>
            {/* Compte calculé depuis les données, jamais écrit en dur. */}
            {n} {cat.unit}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 88px)",
              lineHeight: 1,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {cat.title}
          </h1>
          {cat.description && (
            <p
              style={{
                margin: 0,
                maxWidth: "48ch",
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(18px, 2.2vw, 21px)",
                lineHeight: "var(--jk-lh-body)",
                color: "var(--jk-ink-mute)",
              }}
            >
              {cat.description}
            </p>
          )}
        </div>
      </header>

      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          borderBottom: cat.series.length
            ? "1px solid var(--jk-rule)"
            : undefined,
        }}
      >
        {cat.series.map((s, i) => (
          <IndexRow
            key={s.slug}
            href={`/travaux/${cat.slug}/${s.slug}`}
            num={String(i + 1).padStart(2, "0")}
            title={s.title}
            location={s.location}
            period={s.period}
            previewSrc={s.coverSrc || s.photos[0]?.src}
            delay={Math.min(i, 5) * 70}
          />
        ))}
      </ul>

      {cat.series.length === 0 && (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 14 }}>
          Aucune série publiée dans cet univers pour l&apos;instant.
        </p>
      )}
    </main>
  );
}
