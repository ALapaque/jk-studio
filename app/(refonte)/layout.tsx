import { getSiteContent } from "@/lib/content";
import { JsonLd } from "@/components/jk/JsonLd";
import { Nav } from "@/components/jk/Nav";
import { Footer } from "@/components/jk/Footer";
import { PageTransition } from "@/components/jk/PageTransition";
import { IntroLoader } from "@/components/jk/IntroLoader";

/* Layout des écrans de la refonte.
 *
 * Volontairement SANS `SiteChrome` : celui-ci apporte le header et le footer
 * de l'ancien site, plus le moteur d'animation historique (curseur custom,
 * grain, parallaxe, transitions plein écran, loader d'intro). Tant que les
 * écrans de la refonte vivaient dedans, ils portaient les bons tokens mais
 * restaient encadrés par la coquille de l'ancien design — ce qui domine
 * l'impression visuelle.
 *
 * Ce retrait règle deux problèmes d'un coup : la fidélité à la maquette, et
 * le LCP mesuré au Lot 7 (214 Ko de JS et 6 fichiers de police pour deux
 * familles utiles venaient de ce layout partagé).
 *
 * Le thème reste fourni par <ThemeProvider> du layout racine : la bascule
 * clair/sombre continue donc de fonctionner ici. */

export default async function RefonteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  const items = [
    { href: "/travaux", label: content.nav.portfolio },
    // Entrée demandée par le §9, absente jusqu'ici.
    { href: "/tirages", label: content.nav.prints },
    { href: "/a-propos", label: content.nav.about },
    { href: "/contact", label: content.nav.contact },
  ];

  return (
    <div
      style={{
        background: "var(--jk-bg)",
        color: "var(--jk-ink)",
        fontFamily: "var(--jk-sans)",
        minHeight: "100dvh",
      }}
    >
      <JsonLd content={content} />
      {/* Intro jouée au chargement : le nom du studio se remplit, puis se
          retire. Au-dessus de tout (z-index 995), une fois par session. */}
      <IntroLoader
        brandName={content.brand.name}
        tagline={content.brand.tagline}
      />
      {/* Le voile enveloppe nav, contenu et footer : l'interception des clics
          couvre tous les liens, et le voile (z-index élevé) passe au-dessus de
          la nav fixe. */}
      <PageTransition brandName={content.brand.name}>
        <Nav
          brandName={content.brand.name}
          items={items}
          menuLabel={content.nav.menu}
          closeLabel={content.nav.close}
        />
        {children}
        <Footer content={content} />
      </PageTransition>
    </div>
  );
}
