import Image from "next/image";
import { CATEGORIES } from "@/lib/demo-data";
import { countLabel } from "@/lib/types";
import { getSiteContent } from "@/lib/content";
import { HeroCard } from "@/components/HeroCard";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryIndex } from "@/components/CategoryIndex";
import { TransitionLink } from "@/components/motion/TransitionLink";

const IMG = (id: string, w: number, h: number) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&h=${h}&fit=crop&auto=format`;

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: 9.5,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--ink2)",
};

export default async function HomePage() {
  const content = await getSiteContent();
  const sectionPad = "clamp(40px,5vw,70px) clamp(20px,4vw,56px)";

  return (
    <main>
      {/* ===================== HERO ===================== */}
      <section
        style={{
          position: "relative",
          height: "100vh",
          minHeight: 660,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 50% 42%, var(--heroA) 0%, var(--bg) 62%)",
        }}
      >
        <HeroCard
          href="/travaux/mariage"
          label="Mariage"
          size="big"
          position={{ right: "6%", top: "12%", width: "clamp(150px,19vw,320px)", zIndex: 3 }}
          para={{ mx: 22, sy: 0.07, r3d: "4,-7,2.5" }}
          aspect="16 / 11"
          img={{ src: IMG("1515934751635-c81c6bc9a2d8", 900, 620), alt: "Aperçu — mariage, bal de nuit" }}
          tag="MARIAGE — 02"
          tagRight="GAND"
        />
        <HeroCard
          href="/travaux/gaming"
          label="Gaming"
          size="big"
          position={{ left: "9%", bottom: "14%", width: "clamp(170px,21vw,360px)", zIndex: 3 }}
          para={{ mx: 18, sy: 0.09, r3d: "-3.5,6,-2.5" }}
          aspect="16 / 10"
          img={{ src: IMG("1511512578047-dfb367046420", 1000, 640), alt: "Aperçu — gaming, setup néon" }}
          tag="GAMING — 04"
          tagRight="GAND"
        />
        <HeroCard
          href="/travaux/portrait"
          label="Portrait"
          size="small"
          className="hero-3"
          position={{ left: "5%", top: "15%", width: "clamp(110px,14vw,230px)", zIndex: 1, opacity: 0.9 }}
          para={{ mx: 9, sy: -0.04, r3d: "3,8,-5" }}
          aspect="3 / 4"
          img={{ src: IMG("1508214751196-bcfd4ca60f91", 600, 800), alt: "Aperçu — portrait" }}
          tag="PORTRAIT — 01"
        />
        <HeroCard
          href="/travaux/mode"
          label="Mode"
          size="small"
          className="hero-4"
          position={{ right: "13%", bottom: "13%", width: "clamp(96px,12vw,200px)", zIndex: 1, opacity: 0.9 }}
          para={{ mx: 12, sy: -0.06, r3d: "2.5,-8,4" }}
          aspect="3 / 4"
          img={{ src: IMG("1509631179647-0177331693ae", 520, 760), alt: "Aperçu — mode, backstage" }}
          tag="MODE — 03"
        />
        <HeroCard
          href="/travaux/mode"
          label="Mode"
          size="tiny"
          className="hero-5"
          position={{ left: "21%", top: "7%", width: "clamp(88px,10vw,180px)", zIndex: 1, opacity: 0.92 }}
          para={{ mx: 10, sy: -0.05, r3d: "3,-6,3" }}
          aspect="4 / 5"
          img={{ src: IMG("1524504388940-b1c1722653e1", 520, 650), alt: "Aperçu — mode, lookbook" }}
          tag="MODE — 05"
        />
        <HeroCard
          href="/travaux/portrait"
          label="Portrait"
          size="tiny"
          className="hero-6"
          position={{ right: "23%", bottom: "8%", width: "clamp(90px,10.5vw,190px)", zIndex: 1, opacity: 0.92 }}
          para={{ mx: 13, sy: 0.05, r3d: "-3,6,-3" }}
          aspect="3 / 4"
          img={{ src: IMG("1517841905240-472988babdf9", 520, 690), alt: "Aperçu — portrait" }}
          tag="PORTRAIT — 06"
        />
        <HeroCard
          href="/travaux/video"
          label="Vidéo"
          size="tiny"
          className="hero-7"
          position={{ left: "1.5%", top: "45%", width: "clamp(96px,11vw,196px)", zIndex: 1, opacity: 0.9 }}
          para={{ mx: 8, sy: -0.04, r3d: "-2.5,7,-4" }}
          aspect="16 / 10"
          img={{ src: IMG("1492691527719-9d1e07e534b4", 560, 350), alt: "Aperçu — vidéo" }}
          tag="VIDÉO — 07"
        />
        <HeroCard
          href="/travaux/mariage"
          label="Mariage"
          size="tiny"
          className="hero-8"
          position={{ right: "2%", top: "42%", width: "clamp(96px,11vw,196px)", zIndex: 1, opacity: 0.9 }}
          para={{ mx: 8, sy: 0.04, r3d: "3,-7,3" }}
          aspect="3 / 2"
          img={{ src: IMG("1519741497674-611481863552", 560, 373), alt: "Aperçu — mariage" }}
          tag="MARIAGE — 08"
        />

        {/* titre centré */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 2,
            pointerEvents: "none",
            textAlign: "center",
            padding: "0 16px",
          }}
        >
          <div>
            <div
              data-reveal="rise"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10.5,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "var(--ink2)",
                marginBottom: 24,
              }}
            >
              {content.hero.eyebrow}
            </div>
            <h1
              data-para="1"
              data-mx="-7"
              style={{
                margin: 0,
                fontFamily: "var(--font-serif), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(48px,11vw,170px)",
                lineHeight: 0.93,
                letterSpacing: "-0.015em",
                color: "var(--ink)",
              }}
            >
              {content.hero.titleLines.map((line, i) => (
                <span
                  key={i}
                  data-reveal="rise"
                  data-delay={60 + i * 100}
                  style={{ display: "block" }}
                >
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </div>

        {/* barre bas */}
        <div
          data-reveal="rise"
          data-delay="300"
          style={{
            position: "absolute",
            left: "clamp(20px,4vw,56px)",
            right: "clamp(20px,4vw,56px)",
            bottom: 24,
            zIndex: 4,
          }}
        >
          <div style={{ height: 1, background: "var(--line)", position: "relative", marginBottom: 12 }}>
            <span style={{ position: "absolute", left: 0, top: -1, width: 64, height: 3, background: "var(--accent)" }} />
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "8px 14px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 9.5,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--ink2)",
            }}
          >
            <span>((défiler))</span>
            <span style={{ textAlign: "center" }}>{content.hero.categoriesLine}</span>
            <span>{content.hero.coords}</span>
          </div>
        </div>
      </section>

      {/* ===================== 01 LE STUDIO ===================== */}
      <section
        style={{
          maxWidth: 1560,
          margin: "0 auto",
          padding: "clamp(90px,12vw,170px) clamp(20px,4vw,56px) clamp(40px,5vw,70px)",
        }}
      >
        <SectionHeader num="01" title="Le studio" />
        <div className="two-col two-col--studio">
          <p
            data-reveal="rise"
            style={{
              margin: 0,
              fontFamily: "var(--font-serif), serif",
              fontWeight: 400,
              fontSize: "clamp(30px,3.4vw,52px)",
              lineHeight: 1.14,
              color: "var(--ink)",
            }}
          >
            {content.studio.lead}
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
              {content.studio.leadEm}
            </em>
          </p>
          <div>
            <p
              data-reveal="rise"
              data-delay="80"
              style={{
                margin: "0 0 28px",
                fontSize: 15.5,
                lineHeight: 1.75,
                color: "var(--body)",
                maxWidth: "46ch",
              }}
            >
              {content.studio.paragraph}
            </p>
            <div
              data-reveal="rise"
              data-delay="140"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--ink2)",
              }}
            >
              {content.studio.facts.map((f, i, arr) => (
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
          </div>
        </div>
      </section>

      {/* ===================== 02 SÉLECTION ===================== */}
      <section style={{ maxWidth: 1560, margin: "0 auto", padding: sectionPad }}>
        <SectionHeader num="02" title="Sélection 2026" marginBottom="clamp(44px,5.5vw,80px)" />

        {/* Row 1 — Mariage */}
        <div className="grid12" style={{ alignItems: "end", marginBottom: "clamp(80px,10vw,150px)" }}>
          <TransitionLink
            href="/travaux/mariage/salome-jan"
            transitionLabel="Salomé & Jan"
            data-cursor="view"
            style={{ gridColumn: "1 / span 8", textAlign: "left" }}
          >
            <span
              data-reveal="mask"
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "3 / 2",
                overflow: "hidden",
                background: "var(--bg2)",
                boxShadow: "0 0 110px var(--glow)",
              }}
            >
              <Image
                data-para="1"
                data-sy="0.05"
                data-s="1.12"
                src={IMG("1529636798458-92182e662485", 1500, 1000)}
                alt="Salomé et Jan — première danse"
                fill
                sizes="(max-width:760px) 100vw, 66vw"
                style={{ objectFit: "cover", filter: "var(--pf)" }}
              />
              <span style={{ position: "absolute", top: 14, left: 16, fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.12em", color: "#fff", mixBlendMode: "difference" }}>
                FIG. 01
              </span>
            </span>
          </TransitionLink>
          <div style={{ gridColumn: "9 / span 4", paddingBottom: 8 }}>
            <div data-reveal="rise" style={monoLabel}>Mariage — Gand, 2026</div>
            <div data-reveal="rise" data-delay="60" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(26px,2.6vw,38px)", color: "var(--ink)", marginTop: 10 }}>
              Salomé &amp; Jan
            </div>
            <p data-reveal="rise" data-delay="110" style={{ margin: "12px 0 20px", fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: 17.5, lineHeight: 1.4, color: "var(--body)" }}>
              Une journée entière, une averse parfaite.
            </p>
            <TransitionLink href="/travaux/mariage/salome-jan" transitionLabel="Salomé & Jan" data-cursor="link" data-reveal="rise" data-delay="160" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--accent)" }}>
              VOIR LA SÉRIE →
            </TransitionLink>
          </div>
        </div>

        {/* Row 2 — Portrait (image d'abord dans le DOM → au-dessus du texte sur mobile) */}
        <div className="grid12" style={{ alignItems: "start", marginBottom: "clamp(80px,10vw,150px)" }}>
          <TransitionLink
            href="/travaux/portrait/nora-soie"
            transitionLabel="Nora — série soie"
            data-cursor="view"
            style={{ gridColumn: "6 / span 5", textAlign: "left" }}
          >
            <span
              data-reveal="mask"
              style={{ display: "block", position: "relative", aspectRatio: "3 / 4", overflow: "hidden", background: "var(--bg2)", boxShadow: "0 0 110px var(--glow)" }}
            >
              <Image
                data-para="1"
                data-sy="0.06"
                data-s="1.12"
                src={IMG("1544005313-94ddf0286df2", 1000, 1333)}
                alt="Nora — série soie, portrait studio"
                fill
                sizes="(max-width:760px) 100vw, 42vw"
                style={{ objectFit: "cover", filter: "var(--pf)" }}
              />
              <span style={{ position: "absolute", top: 14, left: 16, fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.12em", color: "#fff", mixBlendMode: "difference" }}>
                FIG. 02
              </span>
            </span>
          </TransitionLink>
          <div style={{ gridColumn: "1 / span 4", paddingTop: "clamp(20px,4vw,70px)" }}>
            <div data-reveal="rise" style={monoLabel}>Portrait — Studio, 2026</div>
            <div data-reveal="rise" data-delay="60" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(26px,2.6vw,38px)", color: "var(--ink)", marginTop: 10 }}>
              Nora — série soie
            </div>
            <p data-reveal="rise" data-delay="110" style={{ margin: "12px 0 20px", fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: 17.5, lineHeight: 1.4, color: "var(--body)" }}>
              Série studio — soie, contre-jour, silence.
            </p>
            <TransitionLink href="/travaux/portrait/nora-soie" transitionLabel="Nora — série soie" data-cursor="link" data-reveal="rise" data-delay="160" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.16em", color: "var(--accent)" }}>
              VOIR LA SÉRIE →
            </TransitionLink>
          </div>
        </div>

        {/* Row 3 — Gaming large */}
        <div className="grid12">
          <TransitionLink
            href="/travaux/gaming/lan-charleroi"
            transitionLabel="LAN de Charleroi"
            data-cursor="view"
            style={{ gridColumn: "2 / span 10", textAlign: "left" }}
          >
            <span
              data-reveal="mask"
              style={{ display: "block", position: "relative", aspectRatio: "21 / 10", overflow: "hidden", background: "var(--bg2)", boxShadow: "0 0 110px var(--glow)" }}
            >
              <Image
                data-para="1"
                data-sy="0.05"
                data-s="1.12"
                src={IMG("1542751371-adc38448a05e", 1600, 762)}
                alt="LAN de Charleroi — la finale"
                fill
                sizes="83vw"
                style={{ objectFit: "cover", filter: "var(--pf)" }}
              />
              <span style={{ position: "absolute", top: 14, left: 16, fontFamily: "var(--font-mono), monospace", fontSize: 9, letterSpacing: "0.12em", color: "#fff", mixBlendMode: "difference" }}>
                FIG. 03
              </span>
            </span>
            <span data-reveal="rise" style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 12, alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(22px,2.2vw,32px)", color: "var(--ink)" }}>
                LAN de Charleroi{" "}
                <em style={{ fontStyle: "italic", color: "var(--body)" }}>
                  — trois nuits de finale, néon et sueur froide.
                </em>
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.16em", color: "var(--ink2)", textTransform: "uppercase" }}>
                Gaming — 2025
              </span>
            </span>
          </TransitionLink>
        </div>
      </section>

      {/* ===================== 03 CATÉGORIES ===================== */}
      <section style={{ maxWidth: 1560, margin: "0 auto", padding: "clamp(60px,8vw,120px) clamp(20px,4vw,56px) 0" }}>
        <SectionHeader
          num="03"
          title="Catégories"
          marginBottom="clamp(28px,3.5vw,48px)"
          link={{ href: "/travaux", label: "Index complet →", transitionLabel: "Travaux" }}
        />
        <CategoryIndex
          items={CATEGORIES.map((c) => ({
            slug: c.slug,
            num: c.num,
            title: c.title,
            count: countLabel(c),
            coverSrc: c.coverSrc,
          }))}
        />
      </section>
    </main>
  );
}
