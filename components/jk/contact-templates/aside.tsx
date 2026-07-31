import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";
import type { ContactTemplateProps } from "./types";

/* Contact « aside » — titre large, faits en barre latérale.
 *
 * Grand titre + lead en pleine largeur, puis le formulaire au centre avec les
 * coordonnées en barre latérale. Aéré, hiérarchisé. */

export function ContactAside({ contact, preview = false }: ContactTemplateProps) {
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

      <Reveal as="div" style={{ display: "grid", gap: 20, marginBottom: "clamp(48px, 7vw, 88px)", maxWidth: "24ch" }}>
        <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
          <span style={{ color: "var(--jk-brass)" }}>(05)</span> {contact.eyebrow}
        </span>
        <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
          {contact.title}
        </h1>
        <p style={{ margin: 0, maxWidth: "44ch", fontFamily: "var(--jk-serif)", fontStyle: "italic", fontSize: "clamp(19px, 2.2vw, 26px)", lineHeight: 1.4, color: "var(--jk-ink-mute)" }}>
          {contact.lead}
        </p>
      </Reveal>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 220px) minmax(0, 1fr)",
          gap: "clamp(2.5rem, 6vw, 5rem)",
          alignItems: "start",
        }}
        className="jk-studio-grid"
      >
        {contact.facts.length > 0 ? (
          <Reveal as="div">
            <dl style={{ display: "grid", gap: 18, margin: 0 }}>
              {contact.facts.map((f) => (
                <div key={f.k} style={{ display: "grid", gap: 4 }}>
                  <dt style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
                    {f.k}
                  </dt>
                  <dd style={{ margin: 0, fontSize: 14 }}>{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : (
          <div />
        )}

        <Reveal as="div" style={{ maxWidth: 560 }}>
          <ContactForm projectTypes={contact.projectTypes} preview={preview} />
        </Reveal>
      </div>
    </main>
  );
}
