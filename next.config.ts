import type { NextConfig } from "next";

// Autorise les hôtes d'images distants. En démo : Unsplash + repli picsum.
// En prod : le bucket Supabase (défini via NEXT_PUBLIC_SUPABASE_URL).
const supabaseHost = (() => {
  try {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: {
    // AVIF préféré, repli WebP (§6 du brief : « formats modernes AVIF/WebP »).
    // S'applique aux images servies par next/image — dont le hero de l'accueil
    // et les covers de série, qui sont l'élément LCP en production. AVIF pèse
    // ~20 % de moins que WebP ; il est ~50 % plus lent à encoder au tout premier
    // accès, puis servi depuis le cache (net gain pour le visiteur).
    // Le défilé immersif (SeriesScroller) garde volontairement ses dérivés WebP
    // servis directement par le CDN Supabase : ils contournent next/image pour
    // ne pas consommer le quota de transformations, et ne sont pas l'élément LCP.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : [{ protocol: "https" as const, hostname: "*.supabase.co" }]),
    ],
  },
  // Bascule finale : la refonte a pris les URLs canoniques. On redirige (301)
  // les URLs parallèles utilisées pendant la coexistence, pour ne perdre ni le
  // référencement ni les liens déjà partagés.
  async redirects() {
    return [
      { source: "/accueil", destination: "/", permanent: true },
      { source: "/series", destination: "/travaux", permanent: true },
      {
        source: "/travaux/:categorie/:serie/histoire",
        destination: "/travaux/:categorie/:serie",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
