import { ImageResponse } from "next/og";
import { getSeriesBySlug } from "@/lib/data";

export const alt = "Série — JKStudio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Carte de partage propre à chaque série (§10), composée sur sa cover.
 *
 * Pas de `generateStaticParams` ici : la carte n'est demandée que lorsqu'un
 * réseau social déréférence l'URL. La générer pour toutes les séries au build
 * allongerait celui-ci pour des images que personne ne réclamera peut-être.
 *
 * `next/og` ne sait pas charger nos polices personnalisées sans les embarquer
 * — on reste donc sur la pile système, avec la palette de la refonte. Un
 * embarquement de police alourdirait la fonction pour un gain invisible à
 * cette taille. */

export default async function SeriesOgImage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}) {
  const { categorie, serie } = await params;
  const found = await getSeriesBySlug(categorie, serie);

  const title = found?.series.title ?? "Série";
  const category = found?.category.title ?? "";
  const location = found?.series.location ?? "";
  const period = found?.series.period ?? "";
  const cover = found?.series.coverSrc || found?.series.photos[0]?.src;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0e0c0a",
          color: "#efe9e1",
        }}
      >
        {cover && (
          /* `next/og` compose l'image côté serveur avec son propre moteur de
             rendu : next/image n'y a pas cours, <img> est le seul choix. */
          <img
            src={cover}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        )}
        {/* Voile : sans lui, un titre clair sur une photo claire devient
            illisible dans le fil d'un réseau social. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(to bottom, rgba(14,12,10,.45) 0%, rgba(14,12,10,.30) 45%, rgba(14,12,10,.88) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            padding: 72,
            gap: 20,
          }}
        >
          {category && (
            <div
              style={{
                fontSize: 22,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#b8925a",
              }}
            >
              {category}
            </div>
          )}
          <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -1 }}>
            {title}
          </div>
          <div
            style={{
              display: "flex",
              gap: 28,
              fontSize: 20,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(239,233,225,.72)",
            }}
          >
            {location && <span>{location}</span>}
            {period && <span>{period}</span>}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
