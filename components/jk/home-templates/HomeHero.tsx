import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { HeroSlideshow } from "@/components/jk/HeroSlideshow";

type Hero = {
  src: string;
  alt: string;
  blurDataURL: string;
  subject: string;
  place: string;
} | null;

/** Hero plein écran de l'accueil (diaporama ou image unique) + indice de
 *  défilement. Partagé par les variantes de template d'accueil. */
export function HomeHero({
  heroSlides,
  hero,
  scrollHint,
}: {
  heroSlides: { src: string; caption: string }[];
  hero: Hero;
  scrollHint: string;
}) {
  return (
    <section
      style={{
        position: "relative",
        height: "100svh",
        background: "var(--jk-surface)",
        overflow: "hidden",
      }}
    >
      {heroSlides.length > 0 ? (
        <HeroSlideshow slides={heroSlides} />
      ) : (
        <>
          {hero && (
            <Parallax>
              <Image
                src={hero.src}
                alt={hero.alt}
                fill
                sizes="100vw"
                priority
                placeholder={hero.blurDataURL ? "blur" : "empty"}
                blurDataURL={hero.blurDataURL || undefined}
                style={{ objectFit: "cover" }}
              />
            </Parallax>
          )}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(14,12,10,.62) 0%, rgba(14,12,10,0) 34%, rgba(14,12,10,0) 58%, rgba(14,12,10,.72) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: "var(--jk-gap-page)", bottom: 52 }}>
            <Reveal>
              <Caption subject={hero?.subject} location={hero?.place} variant="hero" tone="onImage" />
            </Reveal>
          </div>
        </>
      )}
      <span
        style={{
          position: "absolute",
          right: "var(--jk-gap-page)",
          bottom: 52,
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          fontSize: 10,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          color: "rgba(239,233,225,.6)",
        }}
      >
        {scrollHint}
        <span aria-hidden style={{ width: 52, height: 1, background: "var(--jk-brass)" }} />
      </span>
    </section>
  );
}
