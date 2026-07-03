import Image from "next/image";
import { TransitionLink } from "./motion/TransitionLink";

type Size = "big" | "small" | "tiny";

const frame: Record<Size, React.CSSProperties> = {
  big: {
    padding: "clamp(7px,0.9vw,13px)",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45), 0 0 80px var(--glow)",
  },
  small: {
    padding: "clamp(6px,0.8vw,11px)",
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
  },
  tiny: {
    padding: "clamp(6px,0.7vw,10px)",
    boxShadow: "0 16px 36px rgba(0,0,0,0.3)",
  },
};

export function HeroCard({
  href,
  label,
  size = "small",
  className,
  position,
  para,
  img,
  aspect,
  tag,
  tagRight,
}: {
  href: string;
  label: string;
  size?: Size;
  className?: string;
  position: React.CSSProperties;
  para: { mx: number; sy: number; r3d: string };
  img: { src: string; alt: string };
  aspect: string;
  tag: string;
  tagRight?: string;
}) {
  const tagSize = size === "tiny" ? 8 : 8.5;
  return (
    <TransitionLink
      href={href}
      transitionLabel={label}
      data-cursor="view"
      data-cursor-label="ENTRER"
      data-para="1"
      data-mx={para.mx}
      data-sy={para.sy}
      data-r3d={para.r3d}
      data-reveal="rise"
      className={className}
      style={{
        position: "absolute",
        background: "none",
        textAlign: "left",
        willChange: "transform",
        ...position,
      }}
    >
      <span
        style={{
          display: "block",
          background: "#f6f1e6",
          ...frame[size],
        }}
      >
        <span
          style={{
            display: "block",
            position: "relative",
            aspectRatio: aspect,
            overflow: "hidden",
            background: "#e8e2d4",
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width:760px) 40vw, 20vw"
            style={{ objectFit: "cover", filter: "var(--pf)" }}
          />
        </span>
        <span
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 8,
            fontFamily: "var(--font-mono), monospace",
            fontSize: tagSize,
            letterSpacing: "0.16em",
            color: "#7a6f5c",
            margin: "clamp(6px,0.8vw,10px) 2px 1px",
          }}
        >
          <span>{tag}</span>
          {tagRight && <span>{tagRight}</span>}
        </span>
      </span>
    </TransitionLink>
  );
}
