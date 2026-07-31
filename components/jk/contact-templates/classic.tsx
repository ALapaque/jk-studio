import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";
import type { ContactTemplateProps } from "./types";

/* Template « classic » de la page Contact — deux colonnes : accroche + faits à
 * gauche, formulaire à droite. Extrait tel quel de la page. */

export function ContactClassic({ contact, preview = false }: ContactTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 520px)",
          gap: "clamp(2.5rem, 6vw, 5rem)",
          alignItems: "start",
        }}
        className="jk-studio-grid"
      >
        <Reveal as="div" style={{ display: "grid", gap: 40 }}>
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
            <span style={{ color: "var(--jk-brass)" }}>(05)</span>
            {contact.eyebrow}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(40px, 6vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "var(--jk-ls-tight)",
            }}
          >
            {contact.title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: "42ch",
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(18px, 2.2vw, 21px)",
              lineHeight: "var(--jk-lh-body)",
              color: "var(--jk-ink-mute)",
            }}
          >
            {contact.lead}
          </p>
          <dl
            style={{
              display: "grid",
              gap: 14,
              margin: 0,
              borderTop: "1px solid var(--jk-rule)",
              paddingTop: 24,
            }}
          >
            {contact.facts.map((f) => (
              <div
                key={f.k}
                style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
              >
                <dt
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--jk-ink-mute)",
                  }}
                >
                  {f.k}
                </dt>
                <dd style={{ margin: 0, fontSize: 13 }}>{f.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal as="div">
          <ContactForm projectTypes={contact.projectTypes} preview={preview} />
        </Reveal>
      </div>
    </main>
  );
}
