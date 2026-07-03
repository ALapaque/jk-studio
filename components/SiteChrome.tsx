"use client";

import { MotionProvider } from "./motion/MotionProvider";
import { TransitionProvider } from "./motion/TransitionProvider";
import { IntroLoader } from "./motion/IntroLoader";
import { Header } from "./Header";
import { Footer, type FooterContent } from "./Footer";

/** Chrome du site public : transitions, moteur d'animation, header/footer,
 *  loader d'intro. (Le thème est fourni plus haut par <ThemeProvider>.) */
export function SiteChrome({
  grain,
  footer,
  children,
}: {
  grain: boolean;
  footer: FooterContent;
  children: React.ReactNode;
}) {
  return (
    <TransitionProvider>
      <MotionProvider grain={grain}>
        <div data-jk="true">
          <Header />
          {children}
          <Footer footer={footer} />
        </div>
        <IntroLoader />
      </MotionProvider>
    </TransitionProvider>
  );
}
