import { VideoProvider, buildEmbedUrl } from "@/lib/video";

/** Iframe responsive 16:9 (ratio via padding-bottom). */
export function VideoEmbed({
  provider,
  videoId,
  title = "Vidéo",
  autoplay,
}: {
  provider: VideoProvider;
  videoId: string;
  title?: string;
  autoplay?: boolean;
}) {
  return (
    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, width: "100%" }}>
      <iframe
        src={buildEmbedUrl(provider, videoId, { autoplay })}
        loading="lazy"
        allow="accelerated-encoding; autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "none",
          background: "#000",
        }}
      />
    </div>
  );
}
