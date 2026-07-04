"use client";

/* Loader d'entrée joué une fois par session : le mot « JKStudio » se
   remplit puis le voile glisse vers le haut. Porté de componentDidMount(). */

import { useEffect, useRef, useState } from "react";
import type { Brand } from "../SiteChrome";

let PLAYED = false; // survit aux navigations client dans la même session

export function IntroLoader({ brand }: { brand: Brand }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (PLAYED || reduced) {
      setDone(true);
      document.body.style.overflow = "";
      return;
    }
    PLAYED = true;
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.clipPath = "inset(0 0% 0 0)";
    }, 300);
    const t2 = setTimeout(() => {
      if (rootRef.current) rootRef.current.style.transform = "translateY(-101%)";
    }, 2050);
    const t3 = setTimeout(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 995,
        background: "var(--bg)",
        display: "grid",
        placeItems: "center",
        transform: "translateY(0%)",
        transition: "transform .75s cubic-bezier(.76,0,.24,1)",
      }}
    >
      <div style={{ textAlign: "center", padding: "0 20px" }}>
        <div
          style={{
            position: "relative",
            display: "inline-block",
            fontFamily: "var(--font-serif), serif",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(60px,11vw,160px)",
            lineHeight: 1,
            letterSpacing: "-0.015em",
            whiteSpace: "nowrap",
            color: "var(--ink)",
          }}
        >
          {brand.logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={brand.logoSrc}
              alt={brand.name}
              style={{ height: "clamp(48px,8vw,110px)", width: "auto", display: "block" }}
            />
          ) : (
            <>
              <span style={{ opacity: 0.16 }}>{brand.name}</span>
              <span
                ref={fillRef}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: "inset(0 100% 0 0)",
                  transition: "clip-path 1.5s cubic-bezier(.65,0,.35,1)",
                }}
              >
                {brand.name}
              </span>
            </>
          )}
        </div>
        {brand.tagline && (
          <div
            style={{
              marginTop: 26,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "var(--ink2)",
            }}
          >
            {brand.tagline}
          </div>
        )}
      </div>
    </div>
  );
}
