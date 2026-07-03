"use client";

/* Masonry + lightbox d'une série. Porté de la grille catégorie et de la
   lightbox de la maquette : zoom photo, embed vidéo, clavier, tactile,
   vignettes. */

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Media } from "@/lib/types";
import { VideoEmbed } from "./VideoEmbed";

const pad = (n: number) => String(n).padStart(2, "0");

export function MediaGallery({
  media,
  categoryTitle,
}: {
  media: Media[];
  categoryTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [full, setFull] = useState(false);
  const lbRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);

  const n = media.length;
  const cur = media[Math.min(idx, n - 1)];

  const openAt = useCallback((i: number) => {
    document.body.style.overflow = "hidden";
    setIdx(i);
    setFull(false);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    if (lbRef.current) lbRef.current.style.opacity = "0";
    setTimeout(() => {
      document.body.style.overflow = "";
      setOpen(false);
    }, 300);
  }, []);

  const nav = useCallback(
    (d: number) => {
      setFull(false);
      setIdx((p) => (p + d + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (!open) return;
    const el = lbRef.current;
    if (el) requestAnimationFrame(() => (el.style.opacity = "1"));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (full) setFull(false);
        else close();
      } else if (e.key === "ArrowRight") nav(1);
      else if (e.key === "ArrowLeft") nav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, full, nav, close]);

  const mediaW = full ? "96vw" : "min(86vw,1280px)";
  const mediaH = full ? "86vh" : "72vh";

  return (
    <>
      {/* ---- masonry ---- */}
      <div style={{ columns: "300px 3", columnGap: "clamp(16px,1.8vw,26px)" }}>
        {media.map((m, i) => {
          const isVideo = m.kind === "video";
          const ar = isVideo ? "16 / 9" : m.ar;
          const cap = isVideo ? m.title : m.caption;
          const src =
            m.kind === "photo"
              ? m.src
              : m.provider === "youtube"
                ? `https://i.ytimg.com/vi/${m.videoId}/hqdefault.jpg`
                : "";
          return (
            <button
              key={m.id}
              onClick={() => openAt(i)}
              data-cursor="view"
              data-cursor-label={isVideo ? "LIRE" : "VOIR"}
              style={{
                display: "block",
                width: "100%",
                background: "none",
                border: "none",
                padding: 0,
                margin: "0 0 clamp(16px,1.8vw,26px)",
                breakInside: "avoid",
                textAlign: "left",
                color: "var(--ink)",
              }}
            >
              <span
                style={{
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: ar,
                  background: "var(--bg2)",
                }}
              >
                {src ? (
                  <Image
                    data-reveal="mask"
                    src={src}
                    alt={cap}
                    fill
                    sizes="(max-width:760px) 100vw, 33vw"
                    className="jk-img-zoom"
                    style={{ objectFit: "cover", filter: "var(--pf)" }}
                  />
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "var(--bg2)",
                    }}
                  />
                )}
                {isVideo && (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          width: 46,
                          height: 46,
                          border: "1px solid rgba(240,236,227,0.85)",
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          color: "#f0ece3",
                          fontSize: 12,
                          background: "rgba(11,10,9,0.28)",
                          backdropFilter: "blur(3px)",
                        }}
                      >
                        ▶
                      </span>
                    </span>
                    {m.duration && (
                      <span
                        style={{
                          position: "absolute",
                          right: 10,
                          bottom: 10,
                          fontFamily: "var(--font-mono), monospace",
                          fontSize: 9,
                          letterSpacing: "0.08em",
                          color: "#f0ece3",
                          background: "rgba(11,10,9,0.7)",
                          padding: "3px 8px",
                          pointerEvents: "none",
                        }}
                      >
                        {m.duration}
                      </span>
                    )}
                  </>
                )}
              </span>
              <span
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 9,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  color: "var(--ink2)",
                }}
              >
                <span
                  style={{
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cap}
                </span>
                <span style={{ flex: "none" }}>
                  {pad(i + 1)} / {pad(n)}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ---- lightbox ---- */}
      {open && cur && (
        <div
          ref={lbRef}
          role="dialog"
          aria-modal="true"
          aria-label={cur.kind === "photo" ? cur.caption : cur.title}
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 940,
            background: "rgba(8,7,6,0.94)",
            backdropFilter: "blur(10px)",
            opacity: 0,
            transition: "opacity .35s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* barre haut */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px clamp(18px,3vw,32px)",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#cfc8ba",
            }}
          >
            <span>
              {categoryTitle.toUpperCase()} — {pad(idx + 1)} / {pad(n)}
            </span>
            <span style={{ display: "flex", gap: 28, alignItems: "center" }}>
              {cur.kind === "photo" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFull((f) => !f);
                  }}
                  data-cursor="link"
                  className="jk-lb-ctrl"
                  style={ctrlText}
                >
                  {full ? "Réduire ⤡" : "Plein écran ⤢"}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                data-cursor="link"
                className="jk-lb-ctrl"
                style={ctrlText}
              >
                Fermer ✕
              </button>
            </span>
          </div>

          {/* média */}
          <div
            style={{
              flex: 1,
              position: "relative",
              display: "grid",
              placeItems: "center",
              padding: "0 clamp(56px,8vw,110px)",
              minHeight: 0,
            }}
            onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchX.current == null) return;
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 55) nav(dx < 0 ? 1 : -1);
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                nav(-1);
              }}
              data-cursor="link"
              aria-label="Photo précédente"
              className="jk-lb-ctrl"
              style={arrow("left")}
            >
              ←
            </button>

            <span
              style={{
                position: "relative",
                display: "inline-grid",
                placeItems: "center",
                maxWidth: "100%",
                maxHeight: "100%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {cur.kind === "photo" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cur.src}
                  alt={cur.caption}
                  onClick={() => setFull((f) => !f)}
                  data-cursor="view"
                  data-cursor-label={full ? "RÉDUIRE" : "PLEIN ÉCRAN"}
                  style={{
                    maxWidth: mediaW,
                    maxHeight: mediaH,
                    objectFit: "contain",
                    filter: "var(--pf)",
                    boxShadow: "0 0 130px var(--glow)",
                    transition:
                      "max-height .5s cubic-bezier(.22,1,.36,1), max-width .5s cubic-bezier(.22,1,.36,1)",
                  }}
                />
              ) : (
                <span
                  style={{
                    width: "min(86vw,1280px)",
                    maxWidth: mediaW,
                    boxShadow: "0 0 130px var(--glow)",
                  }}
                >
                  <VideoEmbed
                    provider={cur.provider}
                    videoId={cur.videoId}
                    title={cur.title}
                    autoplay
                  />
                </span>
              )}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nav(1);
              }}
              data-cursor="link"
              aria-label="Photo suivante"
              className="jk-lb-ctrl"
              style={arrow("right")}
            >
              →
            </button>
          </div>

          {/* chrome bas */}
          {!full && (
            <div onClick={(e) => e.stopPropagation()}>
              <div style={{ textAlign: "center", padding: "14px 20px 6px" }}>
                <div
                  style={{
                    fontFamily: "var(--font-serif), serif",
                    fontStyle: "italic",
                    fontSize: 19,
                    color: "#f0ece3",
                  }}
                >
                  {cur.kind === "photo" ? cur.caption : cur.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 9.5,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#9a9285",
                    marginTop: 7,
                  }}
                >
                  {(cur.meta + (cur.kind === "video" && cur.duration ? " · " + cur.duration : "")).toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "14px 20px 20px",
                  overflowX: "auto",
                }}
              >
                {media.map((m, i) => {
                  const tsrc =
                    m.kind === "photo"
                      ? m.src
                      : m.provider === "youtube"
                        ? `https://i.ytimg.com/vi/${m.videoId}/hqdefault.jpg`
                        : "";
                  return (
                    <button
                      key={m.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFull(false);
                        setIdx(i);
                      }}
                      data-cursor="link"
                      style={{
                        flex: "none",
                        width: 44,
                        height: 56,
                        padding: 0,
                        background: "var(--bg2)",
                        border: `1px solid ${i === idx ? "var(--accent)" : "transparent"}`,
                        opacity: i === idx ? 1 : 0.45,
                        transition: "opacity .25s ease",
                      }}
                    >
                      {tsrc && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={tsrc}
                          alt=""
                          loading="lazy"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                            filter: "var(--pf)",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const ctrlText: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "#cfc8ba",
  font: "inherit",
  letterSpacing: "inherit",
  textTransform: "inherit",
};

const arrow = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  [side]: "clamp(10px,2vw,26px)",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "1px solid rgba(240,236,227,0.3)",
  borderRadius: "50%",
  width: 46,
  height: 46,
  color: "#f0ece3",
  fontSize: 16,
  display: "grid",
  placeItems: "center",
});
