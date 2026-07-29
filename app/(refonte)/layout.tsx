import { getSiteContent } from "@/lib/content";
import { JsonLd } from "@/components/jk/JsonLd";
import { Nav } from "@/components/jk/Nav";
import { Footer } from "@/components/jk/Footer";

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
    { href: "/series", label: content.nav.portfolio },
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
      <Nav brandName={content.brand.name} items={items} />
      {children}
      <Footer content={content} />
    </div>
  );
}
