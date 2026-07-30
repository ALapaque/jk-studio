import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { Reveal } from "@/components/jk/Reveal";
import { ContactForm } from "@/components/ContactForm";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getSiteContent();
  return { title: contact.eyebrow, description: contact.lead };
}

/* Contact (refonte). « Écrivons-le en images », formulaire minimal avec
 * validation serveur et anti-spam sans CAPTCHA (honeypot + rate-limit) —
 * repris tels quels du Lot 6. */

export default async function ContactPage() {
  const { contact } = await getSiteContent();

  return (
    <main
      style={{
        minHeight: "100dvh",
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
          <ContactForm projectTypes={contact.projectTypes} />
        </Reveal>
      </div>
    </main>
  );
}
