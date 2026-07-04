import type { Metadata } from "next";
import { Instrument_Serif, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import { getAppearance, getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { SITE_URL } from "@/lib/site";

const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const sans = Archivo({
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

const mono = Space_Mono({
  variable: "--font-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
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
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
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
