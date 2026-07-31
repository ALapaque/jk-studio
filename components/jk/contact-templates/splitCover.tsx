import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";
import type { ContactTemplateProps } from "./types";

/* Contact « split-cover » — panneau + carte.
 *
 * Un panneau plein (surface) qui va au bord gauche, portant l'accroche et les
 * coordonnées en grand, et le formulaire posé en carte à droite. Plus affirmé
 * que `classic`. */

export function ContactSplitCover({ contact, preview = false }: ContactTemplateProps) {
  return (
    <main style={{ minHeight: "100svh" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          minHeight: "100svh",
          alignItems: "stretch",
        }}
        className="jk-studio-grid"
      >
        {/* Panneau gauche */}
        <div
          style={{
            background: "var(--jk-surface)",
            padding:
              "clamp(96px, 14vh, 150px) clamp(2.5rem, 5vw, 5rem) clamp(56px, 8vw, 96px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 48,
          }}
        >
          <Reveal as="div" style={{ display: "grid", gap: 28 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "var(--jk-track-label)",
                textTransform: "uppercase",
                color: "var(--jk-brass)",
              }}
            >
              (05) {contact.eyebrow}
            </span>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontWeight: 400,
                fontSize: "clamp(40px, 5.4vw, 76px)",
                lineHeight: 1.0,
                letterSpacing: "var(--jk-ls-display)",
              }}
            >
              {contact.title}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "36ch",
                fontFamily: "var(--jk-serif)",
                fontStyle: "italic",
                fontSize: "clamp(19px, 2.2vw, 26px)",
                lineHeight: 1.4,
                color: "var(--jk-ink-mute)",
              }}
            >
              {contact.lead}
            </p>
          </Reveal>

          {contact.facts.length > 0 && (
            <dl style={{ display: "grid", gap: 14, margin: 0, borderTop: "1px solid var(--jk-rule)", paddingTop: 24 }}>
              {contact.facts.map((f) => (
                <div key={f.k} style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <dt style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
                    {f.k}
                  </dt>
                  <dd style={{ margin: 0, fontSize: 13 }}>{f.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Formulaire droite */}
        <div
          style={{
            padding:
              "clamp(96px, 14vh, 150px) clamp(2.5rem, 5vw, 5rem) clamp(56px, 8vw, 96px)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Reveal as="div" style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
            <ContactForm projectTypes={contact.projectTypes} preview={preview} />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
