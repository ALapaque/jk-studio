// Parsing d'URL vidéo (admin) + reconstruction de l'URL d'embed (front).
// Repris de la spec §4, généralisé aux deux providers.

export type VideoProvider = "youtube" | "vimeo";

export interface ParsedVideo {
  provider: VideoProvider;
  videoId: string;
}

/** Extrait provider + id d'une URL collée. Renvoie null si non reconnue. */
export function parseVideoUrl(url: string): ParsedVideo | null {
  if (!url) return null;
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return { provider: "youtube", videoId: yt[1] };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { provider: "vimeo", videoId: vm[1] };
  return null;
}

/** URL d'embed épurée (RGPD YouTube, sans branding Vimeo). */
export function buildEmbedUrl(
  provider: VideoProvider,
  videoId: string,
  opts: { autoplay?: boolean } = {},
): string {
  if (provider === "youtube") {
    const p = new URLSearchParams({ rel: "0", modestbranding: "1" });
    if (opts.autoplay) p.set("autoplay", "1");
    return `https://www.youtube-nocookie.com/embed/${videoId}?${p}`;
  }
  const p = new URLSearchParams({ title: "0", byline: "0", portrait: "0" });
  if (opts.autoplay) p.set("autoplay", "1");
  return `https://player.vimeo.com/video/${videoId}?${p}`;
}

/** Vignette d'aperçu pour un provider (best-effort). */
export function videoThumb(provider: VideoProvider, videoId: string): string {
  return provider === "youtube"
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : "";
}
