"use client";

import { Appearance } from "@/lib/theme";
import { ThemeProvider } from "./ThemeProvider";
import { MotionProvider } from "./motion/MotionProvider";
import { TransitionProvider } from "./motion/TransitionProvider";
import { IntroLoader } from "./motion/IntroLoader";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Providers({
  appearance,
  children,
}: {
  appearance: Appearance;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider appearance={appearance}>
      <TransitionProvider>
        <MotionProvider grain={appearance.grain}>
          <div data-jk="true">
            <Header />
            {children}
            <Footer />
          </div>
          <IntroLoader />
        </MotionProvider>
      </TransitionProvider>
    </ThemeProvider>
  );
}
