import { TransitionLink } from "@/components/motion/TransitionLink";
import { getSiteContent } from "@/lib/content";

export default async function NotFound() {
  const { notFound } = await getSiteContent();
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <div>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10.5,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--ink2)",
            marginBottom: 20,
          }}
        >
          {notFound.eyebrow}
        </div>
        <h1
          style={{
            margin: "0 0 28px",
            fontFamily: "var(--font-serif), serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(48px,9vw,120px)",
            lineHeight: 0.95,
            letterSpacing: "-0.015em",
          }}
        >
          {notFound.title}
        </h1>
        <TransitionLink
          href="/"
          transitionLabel="Accueil"
          data-cursor="link"
          className="jk-cta"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--accent)",
          }}
        >
          {notFound.cta}
        </TransitionLink>
      </div>
    </main>
  );
}
