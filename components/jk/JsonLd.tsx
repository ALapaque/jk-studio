import type { SiteContent } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/** Données structurées `LocalBusiness` + `Photographer` (§10).
 *
 *  Entièrement construites depuis `site_content` : nom, e-mail, réseaux et
 *  adresse viennent de la base, jamais du code. Un champ vide est omis du
 *  JSON plutôt que publié à vide — déclarer une adresse ou un réseau
 *  inexistant dégraderait la fiche aux yeux des moteurs.
 *
 *  ÉCART ASSUMÉ AVEC LE BRIEF : le §10 demande un type `Photographer`, qui
 *  n'existe pas dans le vocabulaire schema.org — `photographer` n'y est
 *  qu'une *propriété* de CreativeWork. Le déclarer produirait un type inconnu,
 *  ignoré au mieux, pénalisant au pire. On utilise donc
 *  `["LocalBusiness", "ProfessionalService"]`, tous deux valides, et le métier
 *  est porté par `knowsAbout` — sémantiquement correct et réellement exploité.
 *  Les deux types sont dans un seul nœud pour éviter deux entités concurrentes
 *  décrivant le même studio. */
export function JsonLd({ content }: { content: SiteContent }) {
  const { brand, contact, footer } = content;

  // Les réseaux sont stockés en libellés (« Instagram », « Vimeo »…), pas en
  // URLs : sans URL vérifiable, on n'invente pas de `sameAs`.
  const sameAs = [...(footer.socials ?? [])].filter((s) =>
    /^https?:\/\//i.test(s),
  );

  // `contact.facts` porte des paires libellé/valeur libres. On n'en extrait
  // l'adresse que si elle est explicitement nommée.
  const street = contact.facts?.find((f) =>
    /studio|adresse/i.test(f.k),
  )?.v;

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: brand.name,
    description: brand.tagline,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    areaServed: "BE",
    knowsAbout: ["Photographie", "Photographie de mariage", "Photographie d'événement"],
  };

  if (contact.email) data.email = contact.email;
  if (sameAs.length) data.sameAs = sameAs;
  if (street) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: "Bruxelles",
      addressCountry: "BE",
    };
  }

  return (
    <script
      type="application/ld+json"
      // Contenu maîtrisé (base du site) et sérialisé par JSON.stringify :
      // pas d'interpolation de chaîne brute dans le script.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
