import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";
import type { ContactTemplateProps } from "./types";

/* Contact « minimal » — formulaire centré, très sobre.
 *
 * Une seule colonne étroite et centrée : accroche, titre, lead, puis le
 * formulaire. Pas de colonne de faits. Pour aller à l'essentiel. */

export function ContactMinimal({ contact, preview = false }: ContactTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(120px, 18vh, 190px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div style={{ margin: "0 auto", maxWidth: 560, display: "grid", gap: 40 }}>
        <Reveal as="div" style={{ display: "grid", gap: 18, textAlign: "center", justifyItems: "center" }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            <span style={{ color: "var(--jk-brass)" }}>(05)</span> {contact.eyebrow}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(36px, 5.4vw, 60px)",
              lineHeight: 1.04,
              letterSpacing: "var(--jk-ls-tight)",
            }}
          >
            {contact.title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "40ch",
              fontFamily: "var(--jk-serif)",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2vw, 21px)",
              lineHeight: 1.4,
              color: "var(--jk-ink-mute)",
            }}
          >
            {contact.lead}
          </p>
          <span aria-hidden style={{ width: 40, height: 1, background: "var(--jk-brass)", marginTop: 6 }} />
        </Reveal>

        <Reveal as="div">
          <ContactForm projectTypes={contact.projectTypes} preview={preview} />
        </Reveal>
      </div>
    </main>
  );
}
