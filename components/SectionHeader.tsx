import { TransitionLink } from "./motion/TransitionLink";

/** En-tête de section « (0X) Titre —————— [lien] ». */
export function SectionHeader({
  num,
  title,
  link,
  marginBottom = "clamp(36px,4.5vw,60px)",
}: {
  num: string;
  title: string;
  link?: { href: string; label: string; transitionLabel: string };
  marginBottom?: string;
}) {
  return (
    <div
      data-reveal="rise"
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        marginBottom,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 11,
          color: "var(--accent)",
        }}
      >
        ({num})
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10.5,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--ink2)",
        }}
      >
        {title}
      </span>
      <span
        style={{ flex: 1, height: 1, background: "var(--line)", alignSelf: "center" }}
      />
      {link && (
        <TransitionLink
          href={link.href}
          transitionLabel={link.transitionLabel}
          data-cursor="link"
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.16em",
            color: "var(--accent)",
            textTransform: "uppercase",
          }}
        >
          {link.label}
        </TransitionLink>
      )}
    </div>
  );
}
