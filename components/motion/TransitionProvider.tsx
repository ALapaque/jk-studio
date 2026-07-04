"use client";

/* Voile de transition plein écran, porté de goTo() de la maquette :
   le voile monte, le mot de la destination se remplit (clip-path), on
   navigue sous le voile, puis il se retire. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/navigation";

interface TransitionCtx {
  navigate: (href: string, label?: string) => void;
}

const Ctx = createContext<TransitionCtx | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ovRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);

  const navigate = useCallback(
    (href: string, label = "") => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const o = ovRef.current;
      if (busy.current) return;
      if (reduced || !o) {
        router.push(href);
        window.scrollTo(0, 0);
        return;
      }
      busy.current = true;
      if (labelRef.current) labelRef.current.textContent = label;
      if (fillRef.current) {
        fillRef.current.textContent = label;
        fillRef.current.style.transition = "none";
        fillRef.current.style.clipPath = "inset(0 100% 0 0)";
      }
      o.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
      o.style.transform = "translateY(0%)";
      setTimeout(() => {
        if (fillRef.current) {
          fillRef.current.style.transition =
            "clip-path .9s cubic-bezier(.65,0,.35,1)";
          void fillRef.current.offsetWidth;
          fillRef.current.style.clipPath = "inset(0 0% 0 0)";
        }
      }, 450);
      setTimeout(() => {
        router.push(href);
        window.scrollTo(0, 0);
      }, 720);
      setTimeout(() => {
        o.style.transform = "translateY(-101%)";
        setTimeout(() => {
          o.style.transition = "none";
          o.style.transform = "translateY(101%)";
          busy.current = false;
        }, 660);
      }, 1550);
    },
    [router],
  );

  // Précédent / Suivant du navigateur (popstate) : App Router re-rend la page et
  // MotionProvider relance les révélations, ce qui « clignote » sans voile.
  // On couvre instantanément puis on retire le voile en douceur une fois la
  // nouvelle page montée et les révélations relancées.
  useEffect(() => {
    const onPop = () => {
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const o = ovRef.current;
      if (!o || reduced || busy.current) return;
      busy.current = true;
      if (labelRef.current) labelRef.current.textContent = "";
      if (fillRef.current) {
        fillRef.current.textContent = "";
        fillRef.current.style.clipPath = "inset(0 100% 0 0)";
      }
      // couverture instantanée (cache le flash immédiat)
      o.style.transition = "none";
      o.style.transform = "translateY(0%)";
      void o.offsetWidth;
      // retrait en douceur
      setTimeout(() => {
        o.style.transition = "transform .6s cubic-bezier(.76,0,.24,1)";
        o.style.transform = "translateY(-101%)";
        setTimeout(() => {
          o.style.transition = "none";
          o.style.transform = "translateY(101%)";
          busy.current = false;
        }, 640);
      }, 700);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <Ctx.Provider value={{ navigate }}>
      {children}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 990,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          ref={ovRef}
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--wipe)",
            transform: "translateY(101%)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div style={{ textAlign: "center", padding: "0 20px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--bg)",
                opacity: 0.45,
                marginBottom: 20,
              }}
            >
              JKStudio
            </div>
            <div
              style={{
                position: "relative",
                display: "inline-block",
                fontFamily: "var(--font-serif), serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(52px,9vw,132px)",
                lineHeight: 1,
                letterSpacing: "-0.015em",
                whiteSpace: "nowrap",
              }}
            >
              <span ref={labelRef} style={{ color: "var(--bg)", opacity: 0.2 }} />
              <span
                ref={fillRef}
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  color: "var(--bg)",
                  clipPath: "inset(0 100% 0 0)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Ctx.Provider>
  );
}

export function useTransition(): TransitionCtx {
  return (
    useContext(Ctx) ?? {
      navigate: (href: string) => {
        if (typeof window !== "undefined") window.location.href = href;
      },
    }
  );
}
