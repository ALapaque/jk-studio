import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";
import type { ContactTemplateProps } from "./types";

/* Contact « card » — formulaire en carte.
 *
 * Titre centré, puis le formulaire posé dans une carte encadrée sur fond
 * surface, centrée. Net et posé. */

export function ContactCard({ contact, preview = false }: ContactTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 150px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div style={{ margin: "0 auto", maxWidth: 620, display: "grid", gap: "clamp(32px, 5vw, 52px)" }}>
        <Reveal as="div" style={{ display: "grid", gap: 16, textAlign: "center", justifyItems: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
            <span style={{ color: "var(--jk-brass)" }}>(05)</span> {contact.eyebrow}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(36px, 5.4vw, 60px)", lineHeight: 1.04, letterSpacing: "var(--jk-ls-tight)" }}>
            {contact.title}
          </h1>
          <p style={{ margin: 0, maxWidth: "42ch", fontFamily: "var(--jk-serif)", fontStyle: "italic", fontSize: "clamp(17px, 2vw, 21px)", lineHeight: 1.4, color: "var(--jk-ink-mute)" }}>
            {contact.lead}
          </p>
        </Reveal>

        <Reveal
          as="div"
          style={{
            background: "var(--jk-surface)",
            border: "1px solid var(--jk-rule)",
            padding: "clamp(28px, 5vw, 52px)",
          }}
        >
          <ContactForm projectTypes={contact.projectTypes} preview={preview} />
        </Reveal>
      </div>
    </main>
  );
}
