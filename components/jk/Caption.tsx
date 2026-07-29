import type { CSSProperties } from "react";

/** Tailles de légende définies par la maquette (écran 00, « Système de
 *  légende — 3 tailles »). Les valeurs sont celles du fichier de référence,
 *  pas des approximations. */
export type CaptionVariant = "thumbnail" | "fullscreen" | "hero";

const VARIANTS: Record<
  CaptionVariant,
  { subject: number; dash: number; location: number; track: string; gap: number }
> = {
  thumbnail: { subject: 17, dash: 14, location: 9, track: "0.22em", gap: 9 },
  fullscreen: { subject: 26, dash: 20, location: 10, track: "0.24em", gap: 12 },
  hero: { subject: 40, dash: 28, location: 11, track: "0.26em", gap: 16 },
};

export interface CaptionProps {
  /** Partie italique — `photos.subject`. */
  subject?: string | null;
  /** Partie en capitales — `photos.location`. */
  location?: string | null;
  variant?: CaptionVariant;
  /** Force la couleur du texte (fonds photo sombres, où `--jk-ink` ne convient pas). */
  tone?: "default" | "onImage";
  className?: string;
  style?: CSSProperties;
}

/** Légende éditoriale : « <sujet> — <LIEU> ».
 *
 *  Construite EXCLUSIVEMENT depuis les champs `subject` / `location` de la
 *  base : aucun texte n'est écrit en dur ici, et le composant ne fabrique
 *  jamais de repli à partir d'un titre ou d'un nom de fichier — c'est
 *  précisément le texte générique que la refonte supprime.
 *
 *  Dégradation : si un seul champ est renseigné, il s'affiche seul, sans le
 *  tiret cadratin orphelin. Si les deux sont vides, le composant ne rend
 *  rien (plutôt qu'un tiret flottant ou une boîte vide). */
export function Caption({
  subject,
  location,
  variant = "fullscreen",
  tone = "default",
  className,
  style,
}: CaptionProps) {
  const s = subject?.trim() || "";
  const l = location?.trim() || "";
  if (!s && !l) return null;

  const v = VARIANTS[variant];
  const onImage = tone === "onImage";

  return (
    <span
      className={["jk-caption", className].filter(Boolean).join(" ")}
      style={{ gap: `${v.gap}px`, ...style }}
    >
      {s && (
        <span
          className="jk-caption__subject"
          style={{
            fontSize: `${v.subject}px`,
            color: onImage ? "#efe9e1" : "var(--jk-ink)",
          }}
        >
          {s}
        </span>
      )}
      {/* Le tiret n'apparaît que s'il sépare réellement deux parties. */}
      {s && l && (
        <span
          className="jk-caption__dash"
          style={{ fontSize: `${v.dash}px` }}
          aria-hidden
        >
          —
        </span>
      )}
      {l && (
        <span
          className="jk-caption__location"
          style={{
            fontSize: `${v.location}px`,
            letterSpacing: v.track,
            color: onImage ? "rgba(239,233,225,.72)" : "var(--jk-ink-mute)",
          }}
        >
          {l}
        </span>
      )}
    </span>
  );
}
