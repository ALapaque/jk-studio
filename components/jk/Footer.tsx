import Link from "next/link";
import type { SiteContent } from "@/lib/content";

/** Pied de page de la refonte (maquette, écran 01).
 *
 *  Grande accroche en serif à gauche, coordonnées en capitales espacées à
 *  droite, sur le fond `surface`. Tout le texte vient de `site_content` —
 *  rien n'est écrit en dur ici. */
export function Footer({ content }: { content: SiteContent }) {
  const { footer, contact } = content;

  return (
    <footer
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 40,
        alignItems: "flex-end",
        justifyContent: "space-between",
        padding: "90px var(--jk-gap-page)",
        background: "var(--jk-surface)",
        color: "var(--jk-ink)",
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "var(--jk-serif)",
          fontSize: "clamp(36px, 6vw, 64px)",
          lineHeight: 1,
          letterSpacing: "var(--jk-ls-tight)",
        }}
      >
        {footer.ctaLine1} {footer.ctaLine2}
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 64,
          fontSize: 10,
          letterSpacing: "var(--jk-track-place)",
          textTransform: "uppercase",
          color: "var(--jk-ink-mute)",
          lineHeight: 2.2,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {contact.email && (
            <Link href={`mailto:${contact.email}`} style={{ color: "inherit" }}>
              {contact.email}
            </Link>
          )}
          <Link href="/contact" style={{ color: "inherit" }}>
            {content.nav.contact}
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Les réseaux sont des libellés en base, pas des URLs — on ne
              fabrique donc pas de lien vers une adresse qu'on ignore. */}
          {footer.socials?.slice(0, 2).map((s) => <span key={s}>{s}</span>)}
          <span>{footer.location}</span>
        </div>
      </div>
    </footer>
  );
}
