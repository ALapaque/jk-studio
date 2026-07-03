"use client";

/* Moteur d'animation porté de la maquette (loop()/setupScreen()).
   Une seule boucle requestAnimationFrame pilote :
   - le curseur custom (suivi lissé + modes view/link)
   - la barre de progression de scroll
   - la parallaxe (data-para / data-mx / data-sy / data-s / data-r3d)
   - les boutons magnétiques (data-magnet)
   - l'aperçu flottant au survol des lignes de catégories
   Les révélations au scroll (data-reveal) utilisent un IntersectionObserver.
   Un rescan a lieu à chaque changement de route. */

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";

interface MotionCtx {
  showPreview: (src: string) => void;
  hidePreview: () => void;
}

const Ctx = createContext<MotionCtx | null>(null);

interface Para {
  el: HTMLElement;
  mx: number;
  sy: number;
  s: number;
  r3d: number[] | null;
  ph: number;
  top: number;
  h: number;
}
interface Magnet {
  el: HTMLElement;
  x: number;
  y: number;
}

export function MotionProvider({
  grain = true,
  children,
}: {
  grain?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorLabelRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const pvRef = useRef<HTMLDivElement>(null);
  const pvImgRef = useRef<HTMLImageElement>(null);

  // état mutable (pas de re-render)
  const S = useRef({
    reduced: false,
    fine: false,
    rx: 0,
    ry: 0,
    lmx: 0,
    lmy: 0,
    cx: 0,
    cy: 0,
    cs: 0.16,
    curMode: null as string | null,
    curShown: false,
    pvOn: false,
    pvx: 0,
    pvy: 0,
    paras: [] as Para[],
    magnets: [] as Magnet[],
    raf: 0,
    io: null as IntersectionObserver | null,
    failsafe: 0 as unknown as ReturnType<typeof setTimeout>,
  });

  const revealEl = useCallback((el: HTMLElement, extra = 0) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = "1";
    const mask = el.dataset.reveal === "mask";
    const d = (parseFloat(el.dataset.delay || "0") || 0) + extra;
    el.style.transition =
      `opacity .95s cubic-bezier(.22,1,.36,1) ${d}ms,` +
      `transform .95s cubic-bezier(.22,1,.36,1) ${d}ms,` +
      `clip-path 1.1s cubic-bezier(.65,0,.35,1) ${d}ms`;
    void el.offsetWidth;
    if (mask) {
      el.style.clipPath = "inset(0 0 0% 0)";
      el.style.transform = "scale(1)";
    } else {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  }, []);

  const setupScreen = useCallback(() => {
    const s = S.current;
    // ---- parallaxe ----
    s.paras = [];
    const sy0 = window.scrollY;
    document.querySelectorAll<HTMLElement>("[data-para]").forEach((el) => {
      el.style.transform = "";
      const r = el.getBoundingClientRect();
      const r3d = el.dataset.r3d ? el.dataset.r3d.split(",").map(Number) : null;
      s.paras.push({
        el,
        mx: parseFloat(el.dataset.mx || "0"),
        sy: parseFloat(el.dataset.sy || "0"),
        s: parseFloat(el.dataset.s || "1"),
        r3d,
        ph: s.paras.length * 1.9,
        top: r.top + sy0,
        h: r.height,
      });
      if (s.reduced && r3d) el.style.transform = `rotate(${r3d[2]}deg)`;
    });
    // ---- boutons magnétiques ----
    s.magnets = [];
    document
      .querySelectorAll<HTMLElement>("[data-magnet]")
      .forEach((el) => s.magnets.push({ el, x: 0, y: 0 }));

    // ---- révélations ----
    if (s.reduced) {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]")
        .forEach((el) => revealEl(el));
      return;
    }
    const vh = window.innerHeight;
    let vis = 0;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.dataset.revealed) return;
      const r = el.getBoundingClientRect();
      const mask = el.dataset.reveal === "mask";
      el.style.transition = "none";
      if (mask) {
        el.style.clipPath = "inset(0 0 100% 0)";
        el.style.transform = "scale(1.06)";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
      }
      if (r.top < vh * 0.92) {
        const d = 120 + vis * 90;
        vis++;
        setTimeout(() => revealEl(el), d);
      } else if (s.io) {
        s.io.observe(el);
      } else {
        setTimeout(() => revealEl(el), 200);
      }
    });
    clearTimeout(s.failsafe);
    s.failsafe = setTimeout(() => {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.dataset.revealed) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95) revealEl(el);
        else if (s.io) s.io.observe(el);
      });
    }, 1600);
  }, [revealEl]);

  const remeasure = useCallback(() => {
    const s = S.current;
    const sy0 = window.scrollY;
    s.paras.forEach((p) => {
      p.el.style.transform = "";
      const r = p.el.getBoundingClientRect();
      p.top = r.top + sy0;
      p.h = r.height;
    });
  }, []);

  const showPreview = useCallback((src: string) => {
    const s = S.current;
    if (!s.fine || s.reduced || !pvRef.current) return;
    if (pvImgRef.current) pvImgRef.current.src = src;
    s.pvOn = true;
    pvRef.current.style.opacity = "1";
  }, []);
  const hidePreview = useCallback(() => {
    S.current.pvOn = false;
    if (pvRef.current) pvRef.current.style.opacity = "0";
  }, []);

  // boucle + écouteurs (montage unique)
  useEffect(() => {
    const s = S.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.fine = window.matchMedia("(pointer:fine)").matches;
    s.rx = window.innerWidth / 2;
    s.ry = window.innerHeight / 2;
    s.lmx = s.rx;
    s.lmy = s.ry;
    s.cx = s.rx;
    s.cy = s.ry;
    s.pvx = s.rx;
    s.pvy = s.ry;

    s.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            revealEl(en.target as HTMLElement);
            s.io!.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const onImgErr = (e: Event) => {
      const t = e.target as HTMLImageElement;
      if (
        t &&
        t.tagName === "IMG" &&
        t.src &&
        t.src.indexOf("images.unsplash.com") !== -1 &&
        !t.dataset.fb
      ) {
        t.dataset.fb = "1";
        t.src = `https://picsum.photos/seed/jkfb${t.alt ? t.alt.length : 0}/900/1200`;
      }
    };
    const onMove = (e: MouseEvent) => {
      s.rx = e.clientX;
      s.ry = e.clientY;
      if (cursorRef.current && s.fine && !s.curShown) {
        s.curShown = true;
        cursorRef.current.style.opacity = "1";
      }
    };
    const onOver = (e: MouseEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(
        "[data-cursor]",
      ) as HTMLElement | null;
      s.curMode = t ? t.dataset.cursor || null : null;
      if (t && cursorLabelRef.current)
        cursorLabelRef.current.textContent = t.dataset.cursorLabel || "VOIR";
    };
    const onResize = () => {
      setupScreen();
      remeasure();
    };

    window.addEventListener("error", onImgErr, true);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onResize);
    if (cursorRef.current && !s.fine)
      cursorRef.current.style.display = "none";

    const loop = () => {
      s.raf = requestAnimationFrame(loop);
      const vw = window.innerWidth,
        vh = window.innerHeight,
        sy = window.scrollY;
      if (progressRef.current) {
        const dh = Math.max(1, document.documentElement.scrollHeight - vh);
        progressRef.current.style.transform = `scaleX(${Math.min(1, sy / dh).toFixed(4)})`;
      }
      s.lmx += (s.rx - s.lmx) * 0.06;
      s.lmy += (s.ry - s.lmy) * 0.06;
      const nx = (s.lmx / vw - 0.5) * 2,
        ny = (s.lmy / vh - 0.5) * 2;

      if (s.fine && cursorRef.current) {
        s.cx += (s.rx - s.cx) * 0.22;
        s.cy += (s.ry - s.cy) * 0.22;
        const mode = s.curMode;
        const target = mode === "view" ? 1 : mode === "link" ? 0.42 : 0.16;
        s.cs += (target - s.cs) * 0.18;
        const c = cursorRef.current;
        c.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0) scale(${s.cs.toFixed(3)})`;
        c.style.background = mode === "link" ? "transparent" : "var(--accent)";
        c.style.border = mode === "link" ? "1.5px solid var(--accent)" : "none";
        if (cursorLabelRef.current)
          cursorLabelRef.current.style.opacity =
            mode === "view" && s.cs > 0.8 ? "1" : "0";
      }

      if (!s.reduced && s.paras.length) {
        for (const p of s.paras) {
          if (!p.mx && !p.sy && p.s === 1) continue;
          if (p.top + p.h < sy - 120 || p.top > sy + vh + 120) continue;
          const off = p.top - sy + p.h / 2 - vh / 2;
          const tx = nx * p.mx;
          const ty = ny * p.mx * 0.55 + off * p.sy;
          if (p.r3d) {
            const tn = performance.now() / 1000;
            const fy = Math.sin(tn * 0.8 + p.ph) * 7;
            const rx = p.r3d[0] + ny * -4 + Math.sin(tn * 0.55 + p.ph) * 1.4;
            const ry = p.r3d[1] + nx * 6 + Math.cos(tn * 0.65 + p.ph) * 1.6;
            const rz = p.r3d[2] + Math.sin(tn * 0.4 + p.ph) * 1.2;
            p.el.style.transform = `perspective(1100px) translate3d(${tx.toFixed(1)}px,${(ty + fy).toFixed(1)}px,0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg)`;
            continue;
          }
          p.el.style.transform =
            `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0)` +
            (p.s !== 1 ? ` scale(${p.s})` : "");
        }
      }

      if (!s.reduced && s.magnets.length) {
        for (const m of s.magnets) {
          const r = m.el.getBoundingClientRect();
          if (!r.width) continue;
          const cx = r.left + r.width / 2,
            cy = r.top + r.height / 2;
          const dx = s.rx - cx,
            dy = s.ry - cy;
          const dist = Math.hypot(dx, dy);
          const reach = Math.max(r.width, 110);
          const k = dist < reach ? (1 - dist / reach) * 0.32 : 0;
          m.x += (dx * k - m.x) * 0.16;
          m.y += (dy * k - m.y) * 0.16;
          if (Math.abs(m.x) > 0.1 || Math.abs(m.y) > 0.1)
            m.el.style.transform = `translate3d(${m.x.toFixed(1)}px,${m.y.toFixed(1)}px,0)`;
        }
      }

      if (s.pvOn && pvRef.current) {
        s.pvx += (s.rx + 28 - s.pvx) * 0.12;
        s.pvy += (s.ry - 160 - s.pvy) * 0.12;
        const rot = Math.max(-5, Math.min(5, (s.rx - s.pvx - 28) * 0.05));
        pvRef.current.style.transform = `translate3d(${s.pvx.toFixed(1)}px,${s.pvy.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg)`;
      }
    };
    s.raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(s.raf);
      clearTimeout(s.failsafe);
      window.removeEventListener("error", onImgErr, true);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("resize", onResize);
      s.io?.disconnect();
    };
  }, [revealEl, setupScreen, remeasure]);

  // rescan à chaque changement de route
  useEffect(() => {
    hidePreview();
    const t1 = setTimeout(() => setupScreen(), 60);
    const t2 = setTimeout(() => remeasure(), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, setupScreen, remeasure, hidePreview]);

  return (
    <Ctx.Provider value={{ showPreview, hidePreview }}>
      {children}

      {/* barre de progression */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 960,
          pointerEvents: "none",
        }}
      >
        <div
          ref={progressRef}
          style={{
            height: "100%",
            width: "100%",
            background: "var(--accent)",
            transform: "scaleX(0)",
            transformOrigin: "left",
          }}
        />
      </div>

      {/* aperçu flottant (survol des lignes de catégories) */}
      <div
        ref={pvRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 930,
          pointerEvents: "none",
          width: 250,
          height: 320,
          overflow: "hidden",
          opacity: 0,
          transform: "translate3d(-999px,-999px,0)",
          transition: "opacity .3s ease",
          boxShadow: "0 0 90px var(--glow)",
          background: "var(--bg2)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={pvImgRef}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "var(--pf)",
          }}
        />
      </div>

      {/* grain */}
      {grain && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 950,
            pointerEvents: "none",
            opacity: "var(--grain-opacity)",
            mixBlendMode: "overlay",
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%22140%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.8%22%20numOctaves%3D%222%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22140%22%20height%3D%22140%22%20filter%3D%22url(%23n)%22%20opacity%3D%220.55%22%2F%3E%3C%2Fsvg%3E')",
            backgroundSize: "140px 140px",
          }}
        />
      )}

      {/* curseur custom */}
      <div
        ref={cursorRef}
        aria-hidden
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          pointerEvents: "none",
          width: 52,
          height: 52,
          margin: "-26px 0 0 -26px",
          borderRadius: "50%",
          background: "var(--accent)",
          display: "grid",
          placeItems: "center",
          opacity: 0,
          transition: "opacity .25s ease",
        }}
      >
        <span
          ref={cursorLabelRef}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            color: "var(--bg)",
            opacity: 0,
            transition: "opacity .2s ease",
          }}
        >
          VOIR
        </span>
      </div>
    </Ctx.Provider>
  );
}

export function useMotion(): MotionCtx {
  return useContext(Ctx) ?? { showPreview: () => {}, hidePreview: () => {} };
}
