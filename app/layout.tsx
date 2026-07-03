import type { Metadata } from "next";
import { Instrument_Serif, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { themeInitScript } from "@/lib/theme";
import { getAppearance } from "@/lib/content";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://jkstudio.be"),
  title: {
    default: "JKStudio — Studio photo & vidéo, Bruxelles",
    template: "%s — JKStudio",
  },
  description:
    "Studio photo & vidéo à Bruxelles. Portraits, mariages, mode, culture gaming — une lumière honnête et des gens vrais.",
  openGraph: {
    type: "website",
    locale: "fr_BE",
    siteName: "JKStudio",
  },
};

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
