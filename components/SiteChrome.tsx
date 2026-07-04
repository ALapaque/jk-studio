"use client";

import { MotionProvider } from "./motion/MotionProvider";
import { TransitionProvider } from "./motion/TransitionProvider";
import { IntroLoader } from "./motion/IntroLoader";
import { Header } from "./Header";
import { Footer, type FooterContent } from "./Footer";

export interface Brand {
  name: string;
  tagline: string;
  logoSrc: string;
}
export interface NavContent {
  work: string;
  about: string;
  contact: string;
}

/** Chrome du site public : transitions, moteur d'animation, header/footer,
 *  loader d'intro. (Le thème est fourni plus haut par <ThemeProvider>.) */
export function SiteChrome({
  grain,
  brand,
  nav,
  footer,
  children,
}: {
  grain: boolean;
  brand: Brand;
  nav: NavContent;
  footer: FooterContent;
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider brand={brand}>
      <MotionProvider grain={grain}>
        <div data-jk="true">
          <Header brand={brand} nav={nav} />
          {children}
          <Footer footer={footer} brand={brand} contactLabel={nav.contact} />
        </div>
        <IntroLoader brand={brand} />
      </MotionProvider>
    </TransitionProvider>
  );
}
