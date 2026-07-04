import { getCategories, getHeroItems, getSelection } from "@/lib/data";
import { countLabel } from "@/lib/types";
import { getSiteContent } from "@/lib/content";
import { HeroCards } from "@/components/HeroCards";
import { SelectionRows } from "@/components/SelectionRows";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryIndex } from "@/components/CategoryIndex";

export const revalidate = 60;

export default async function HomePage() {
  const [content, categories, heroItems, selection] = await Promise.all([
    getSiteContent(),
    getCategories(),
    getHeroItems(),
    getSelection(),
  ]);
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
        <HeroCards items={heroItems} />

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
            <span>{content.hero.scrollHint}</span>
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
        <SectionHeader num="01" title={content.home.studioTitle} />
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
        <SectionHeader num="02" title={content.home.selectionTitle} marginBottom="clamp(44px,5.5vw,80px)" />
        <SelectionRows items={selection} />
      </section>

      {/* ===================== 03 CATÉGORIES ===================== */}
      <section style={{ maxWidth: 1560, margin: "0 auto", padding: "clamp(60px,8vw,120px) clamp(20px,4vw,56px) 0" }}>
        <SectionHeader
          num="03"
          title={content.home.categoriesTitle}
          marginBottom="clamp(28px,3.5vw,48px)"
          link={{ href: "/travaux", label: content.home.categoriesLink, transitionLabel: content.nav.work }}
        />
        <CategoryIndex
          items={categories.map((c) => ({
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
