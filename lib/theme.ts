// Jetons de thème — extraits fidèlement de `applyTheme()` de la maquette.
// Le site rend en variables CSS posées sur <html>. La bascule clair/sombre et
// les réglages d'apparence (accent, glow, grain) réutilisent ces mêmes maths.

export type Theme = "dark" | "light";

export interface Appearance {
  /** Thème par défaut au premier chargement. */
  defaultTheme: Theme;
  /** Couleur d'accent (#rrggbb). */
  accent: string;
  /** Grain filmique activé. */
  grain: boolean;
  /** Intensité du halo, 0–2 (1 = valeur maquette). */
  glow: number;
}

export const DEFAULT_APPEARANCE: Appearance = {
  defaultTheme: "dark",
  accent: "#d6bc8c",
  grain: true,
  glow: 1,
};

interface Palette {
  bg: string;
  bg2: string;
  ink: string;
  ink2: string;
  body: string;
  line: string;
  wipe: string;
  heroA: string;
  pf: string;
  /** alpha de base du halo, avant multiplication par glow */
  ga: number;
  grain: number;
}

const DARK: Palette = {
  bg: "#0b0a09",
  bg2: "#171512",
  ink: "#f0ece3",
  ink2: "#8f887b",
  body: "#b9b2a3",
  line: "#26221a",
  wipe: "#f0ece3",
  heroA: "#191510",
  pf: "contrast(1.05) saturate(0.85) brightness(0.95)",
  ga: 0.16,
  grain: 0.055,
};

const LIGHT: Palette = {
  bg: "#f4f0e7",
  bg2: "#e9e3d4",
  ink: "#1a1815",
  ink2: "#8b8474",
  body: "#57534a",
  line: "#dcd4c2",
  wipe: "#12100d",
  heroA: "#fdfaf2",
  pf: "contrast(1.02) saturate(0.9)",
  ga: 0.1,
  grain: 0.07,
};

function hexToRgb(hex: string): [number, number, number] {
  try {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  } catch {
    return [214, 188, 140];
  }
}

/** Fabrique la table de variables CSS pour un thème + une apparence donnés. */
export function buildThemeVars(
  theme: Theme,
  appearance: Partial<Appearance> = {},
): Record<string, string> {
  const glow = appearance.glow == null ? 1 : appearance.glow;
  const light = theme === "light";
  const T = light ? LIGHT : DARK;
  const accent = appearance.accent || (light ? "#1a1815" : "#d6bc8c");
  const [r, g, b] = hexToRgb(accent);
  const ga = (T.ga * glow).toFixed(3);
  return {
    "--bg": T.bg,
    "--bg2": T.bg2,
    "--ink": T.ink,
    "--ink2": T.ink2,
    "--body": T.body,
    "--line": T.line,
    "--accent": accent,
    "--glow": `rgba(${r},${g},${b},${ga})`,
    "--wipe": T.wipe,
    "--heroA": T.heroA,
    "--pf": T.pf,
    "--grain-opacity": String(T.grain),
  };
}

/** Sérialise les variables en une chaîne `--x:y;` (pour l'inline critique). */
export function themeVarsToCss(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

export const STORAGE_KEY = "jk-theme";

/** Script anti-FOUC : pose thème + variables avant l'hydratation. */
export function themeInitScript(appearance: Appearance): string {
  return `(function(){try{
var d=document.documentElement, def=${JSON.stringify(appearance.defaultTheme)};
var t=def; try{var s=localStorage.getItem(${JSON.stringify(STORAGE_KEY)}); if(s==='dark'||s==='light')t=s;}catch(e){}
var A=${JSON.stringify(appearance)};
var DARK={bg:'#0b0a09',bg2:'#171512',ink:'#f0ece3',ink2:'#8f887b',body:'#b9b2a3',line:'#26221a',wipe:'#f0ece3',heroA:'#191510',pf:'contrast(1.05) saturate(0.85) brightness(0.95)',ga:0.16,grain:0.055};
var LIGHT={bg:'#f4f0e7',bg2:'#e9e3d4',ink:'#1a1815',ink2:'#8b8474',body:'#57534a',line:'#dcd4c2',wipe:'#12100d',heroA:'#fdfaf2',pf:'contrast(1.02) saturate(0.9)',ga:0.10,grain:0.07};
var P=t==='light'?LIGHT:DARK; var g=A.glow==null?1:A.glow;
var ac=A.accent||(t==='light'?'#1a1815':'#d6bc8c');
var h=ac.replace('#',''); var r=parseInt(h.slice(0,2),16),gg=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
var v={'--bg':P.bg,'--bg2':P.bg2,'--ink':P.ink,'--ink2':P.ink2,'--body':P.body,'--line':P.line,'--accent':ac,'--glow':'rgba('+r+','+gg+','+b+','+(P.ga*g).toFixed(3)+')','--wipe':P.wipe,'--heroA':P.heroA,'--pf':P.pf,'--grain-opacity':String(P.grain)};
for(var k in v)d.style.setProperty(k,v[k]); d.dataset.theme=t; d.style.background=P.bg;
}catch(e){}})();`;
}
