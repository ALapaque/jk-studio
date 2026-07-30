"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { publicImageUrl } from "@/lib/supabase/storage";

/** Éditeur du corps d'un article, en Markdown.
 *
 *  Onglets Rédiger / Aperçu. L'aperçu utilise le MÊME pipeline que le rendu
 *  public (remark-gfm + rehype-sanitize), donc ce qu'on voit ici est ce qui
 *  sera publié. Les images se téléversent sur place (Storage, préfixe journal/)
 *  et sont insérées en syntaxe Markdown au curseur.
 *
 *  La valeur est soumise via un `<textarea name="body">` — l'action updatePost
 *  la lit comme n'importe quel champ. */

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

export function PostBodyEditor({ initial }: { initial: string }) {
  const [value, setValue] = useState(initial);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const insertAtCursor = (text: string) => {
    const ta = taRef.current;
    if (!ta) {
      setValue((v) => v + text);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    setValue((v) => v.slice(0, start) + text + v.slice(end));
    // Replace le curseur après le texte inséré au prochain tick.
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + text.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const onImage = async (file: File | null) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const sb = createClient();
      const key = `journal/${crypto.randomUUID()}.${slugExt(file.name)}`;
      const { error: upErr } = await sb.storage
        .from(STORAGE_BUCKET)
        .upload(key, file, {
          contentType: file.type || undefined,
          upsert: false,
        });
      if (upErr) throw upErr;
      insertAtCursor(`\n\n![](${publicImageUrl(key)})\n\n`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-md border border-input p-0.5 text-sm">
          {(["write", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded px-3 py-1 ${
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {t === "write" ? "Rédiger" : "Aperçu"}
            </button>
          ))}
        </div>
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={busy}
            onChange={(e) => onImage(e.target.files?.[0] ?? null)}
          />
          <span className="inline-flex items-center gap-1 rounded-md border border-input px-2 py-1 text-xs text-muted-foreground hover:text-foreground">
            <ImagePlus className="size-3.5" />
            {busy ? "Envoi…" : "Insérer une image"}
          </span>
        </label>
      </div>

      {/* Le textarea reste monté (name=body) même en aperçu, pour rester dans le
          formulaire ; on le masque simplement. */}
      <textarea
        ref={taRef}
        name="body"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={18}
        placeholder="Écris en Markdown : **gras**, _italique_, ## titres, listes, [liens](https://…)…"
        className={`w-full rounded-md border border-input bg-transparent p-3 font-mono text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          tab === "preview" ? "hidden" : ""
        }`}
      />

      {/* Aperçu : même classe .jk-prose que le rendu public. Le plugin Tailwind
          Typography (`prose`) n'est pas installé — d'où l'aperçu non formaté
          auparavant. */}
      {tab === "preview" && (
        <div className="jk-prose rounded-md border border-input p-4">
          {value.trim() ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
            >
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-sm text-muted-foreground">
              Rien à prévisualiser.
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
