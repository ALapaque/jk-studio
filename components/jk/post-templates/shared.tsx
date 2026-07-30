import Link from "next/link";
import type { Post } from "@/lib/types";

/* Éléments partagés entre les templates d'article : format de date, eyebrow
 * (date · étiquettes) et lien de retour. Mutualisés pour que les variantes ne
 * diffèrent que par la composition. */

export function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-BE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function NoScriptReveal() {
  return (
    <noscript>
      <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
    </noscript>
  );
}

/** Eyebrow « (06) date · tags ». `onImage` pour les fonds photo sombres. */
export function PostEyebrow({
  post,
  onImage = false,
}: {
  post: Post;
  onImage?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 14,
        fontSize: 10,
        letterSpacing: "var(--jk-track-label)",
        textTransform: "uppercase",
        color: onImage ? "rgba(239,233,225,.72)" : "var(--jk-ink-mute)",
      }}
    >
      <span style={{ color: "var(--jk-brass)" }}>(06)</span>
      {fmtDate(post.date)}
      {post.tags.length ? ` · ${post.tags.join(" · ")}` : ""}
    </span>
  );
}

export function PostBackLink() {
  return (
    <Link
      href="/journal"
      style={{
        fontSize: 11,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--jk-brass)",
        borderBottom: "1px solid var(--jk-brass)",
        paddingBottom: 3,
      }}
    >
      ← Toutes les histoires
    </Link>
  );
}
