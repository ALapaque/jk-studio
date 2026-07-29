import Image from "next/image";
import { publicImageUrl } from "@/lib/supabase/storage";

/** Bandeau de preuve sociale.
 *
 *  Piloté par `content.proof` en base, donc activable/désactivable depuis
 *  l'admin **sans redéploiement** (§8) — les autorisations d'usage des marques
 *  n'étant pas toutes confirmées.
 *
 *  Ne rend rien si le flag est à false ou si aucun client n'est renseigné :
 *  un bandeau vide avec ses filets serait pire que pas de bandeau du tout.
 *
 *  Les noms viennent exclusivement de la base — aucune marque n'est écrite en
 *  dur dans ce composant. */
export function ProofBand({
  label,
  clients,
}: {
  label: string;
  clients: { name: string; logoPath?: string }[];
}) {
  if (!clients.length) return null;

  return (
    <div style={{ padding: "0 var(--jk-gap-page)" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid var(--jk-rule)",
          borderBottom: "1px solid var(--jk-rule)",
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
            paddingRight: 40,
          }}
        >
          {label}
        </span>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "stretch",
            listStyle: "none",
            margin: 0,
            padding: 0,
            color: "var(--jk-ink-mute)",
          }}
        >
          {clients.map((c) => (
            <li
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "22px 32px",
                borderLeft: "1px solid var(--jk-rule)",
                fontSize: 12,
                letterSpacing: "var(--jk-track-place)",
                textTransform: "uppercase",
              }}
            >
              {c.logoPath ? (
                /* Un SVG monochrome hérite de `currentColor` et suit donc le
                   thème clair/sombre sans traitement particulier. */
                <Image
                  src={publicImageUrl(c.logoPath)}
                  alt={c.name}
                  width={96}
                  height={24}
                  style={{ height: 24, width: "auto", objectFit: "contain" }}
                />
              ) : (
                /* Repli exactement conforme à la maquette, qui affiche les
                   clients en capitales espacées plutôt qu'en logotypes. */
                c.name
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
