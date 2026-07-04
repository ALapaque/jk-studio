import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const { nav, contact } = await getSiteContent();
  return {
    title: nav.contact,
    description: contact.lead,
  };
}

export default async function ContactPage() {
  const { contact } = await getSiteContent();

  return (
    <main
      style={{
        maxWidth: 1560,
        margin: "0 auto",
        padding: "clamp(120px,16vh,170px) clamp(20px,4vw,56px) 0",
      }}
    >
      <div className="two-col two-col--contact">
        {/* infos */}
        <div>
          <div data-reveal="rise" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 18 }}>
            {contact.eyebrow}
          </div>
          <h1
            data-reveal="rise"
            data-delay="60"
            style={{
              margin: "0 0 clamp(24px,3vw,36px)",
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(44px,5.5vw,86px)",
              lineHeight: 0.96,
              letterSpacing: "-0.015em",
            }}
          >
            {contact.title}
          </h1>
          <p data-reveal="rise" style={{ margin: "0 0 clamp(30px,3.6vw,44px)", fontSize: 15.5, lineHeight: 1.75, color: "var(--body)", maxWidth: "46ch" }}>
            {contact.lead}
          </p>
          <a
            href={`mailto:${contact.email}`}
            data-cursor="link"
            data-reveal="rise"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-serif), serif",
              fontSize: "clamp(22px,2.4vw,32px)",
              color: "var(--ink)",
              textDecoration: "underline",
              textDecorationColor: "var(--accent)",
              textUnderlineOffset: 8,
              marginBottom: "clamp(30px,3.6vw,44px)",
            }}
          >
            {contact.email}
          </a>
          <div data-reveal="rise" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink2)" }}>
            {contact.facts.map((f, i, arr) => (
              <div
                key={f.k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "12px 0",
                  borderTop: "1px solid var(--line)",
                  borderBottom: i === arr.length - 1 ? "1px solid var(--line)" : undefined,
                }}
              >
                <span>{f.k}</span>
                <span style={{ color: "var(--ink)" }}>{f.v}</span>
              </div>
            ))}
          </div>
          <div data-reveal="rise" style={{ marginTop: 22, fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)" }}>
            {contact.response}
          </div>
        </div>

        {/* formulaire */}
        <div>
          <ContactForm projectTypes={contact.projectTypes} />
        </div>
      </div>
    </main>
  );
}
