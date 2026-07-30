import type { Metadata } from "next";
import {
  Instrument_Serif,
  Archivo,
  IBM_Plex_Sans,
  Space_Mono,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import { getAppearance, getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { SITE_URL } from "@/lib/site";

// Polices de la REFONTE (le site public). Préchargées : elles participent au
// rendu initial — l'élément LCP est le <h1> en Instrument Serif, la nav et les
// légendes sont en IBM Plex Sans. Ce sont les deux seules familles du chemin
// critique après la bascule.
const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const jkSans = IBM_Plex_Sans({
  variable: "--font-jk-sans",
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Polices de l'ADMIN uniquement (tableau de bord derrière authentification, et
// page de connexion). Depuis la bascule, plus aucun écran public ne les rend :
// on ne les précharge donc PAS, pour ne pas encombrer le chemin critique du
// site. `display: swap` leur suffit — l'admin n'est pas sensible au LCP, et
// `next/font` génère un fallback métrique qui évite tout décalage.
const sans = Archivo({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const mono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { brand } = await getSiteContent();
  const name = brand.name || "JKStudio";
  const tagline = brand.tagline || "Studio photo & vidéo, Bruxelles";
  const faviconUrl = publicImageUrl(brand.faviconPath);
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} — ${tagline}`,
      template: `%s — ${name}`,
    },
    description:
      "Studio photo & vidéo à Bruxelles. Portraits, mariages, mode, culture gaming — une lumière honnête et des gens vrais.",
    icons: { icon: faviconUrl || "/favicon.ico" },
    openGraph: {
      type: "website",
      locale: "fr_BE",
      siteName: name,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const appearance = await getAppearance();
  return (
    <html
      lang="fr"
      className={`${serif.variable} ${sans.variable} ${jkSans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript(appearance) }}
        />
      </head>
      <body>
        <ThemeProvider appearance={appearance}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
