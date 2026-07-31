"use client";

import { useState } from "react";
import { Upload, Images, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import { Input } from "./ui";
import { Button } from "@/components/ui/button";
import { LibraryPicker } from "./LibraryPicker";

/** Diaporama du hero de l'accueil : liste ordonnée d'images + un petit texte
 *  (contexte) par image. Deux sources : téléversement direct (Storage, préfixe
 *  hero/) ou choix dans la médiathèque (par référence — on ne stocke que la
 *  clé). Réordonnable, supprimable, légende par image. Sérialisé en JSON dans un
 *  champ caché « heroSlides » soumis avec le formulaire (action saveHeroSlides).
 *
 *  Calqué sur PostMediaEditor : même mécanique, source de vérité unique côté
 *  contenu (`site_content.hero.slides`). */

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

type Row = { path: string; caption: string; key: string };

export function HeroSlidesEditor({
  initial,
  assets,
  folders,
}: {
  initial: { path: string; caption: string }[];
  assets: MediaAssetRow[];
  folders: MediaFolderRow[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial.map((m, i) => ({
      path: m.path,
      caption: m.caption ?? "",
      key: `i-${i}`,
    })),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const [seq, setSeq] = useState(0);

  const serialized = JSON.stringify(
    rows
      .filter((r) => r.path)
      .map((r) => ({ path: r.path, caption: r.caption.trim() })),
  );

  const addPaths = (paths: string[]) =>
    setRows((rs) => [
      ...rs,
      ...paths.map((path, i) => ({ path, caption: "", key: `n-${seq + i}` })),
    ]);
  const patch = (key: string, next: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...next } : r)));
  const remove = (key: string) =>
    setRows((rs) => rs.filter((r) => r.key !== key));
  const move = (key: string, dir: -1 | 1) =>
    setRows((rs) => {
      const i = rs.findIndex((r) => r.key === key);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= rs.length) return rs;
      const copy = [...rs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });

  const onUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setError(null);
    setBusy(true);
    try {
      const sb = createClient();
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = `hero/${crypto.randomUUID()}.${slugExt(file.name)}`;
        const { error: upErr } = await sb.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, {
            contentType: file.type || undefined,
            upsert: false,
          });
        if (upErr) throw upErr;
        uploaded.push(path);
      }
      setRows((rs) => [
        ...rs,
        ...uploaded.map((path, i) => ({
          path,
          caption: "",
          key: `n-${seq + i}`,
        })),
      ]);
      setSeq((s) => s + uploaded.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-3">
      <input type="hidden" name="heroSlides" value={serialized} />

      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={busy}
            onChange={(e) => onUpload(e.target.files)}
          />
          <span className="inline-flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
            <Upload className="size-4" /> {busy ? "Envoi…" : "Uploader des images"}
          </span>
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setPicker(true)}
        >
          <Images className="size-4" /> Depuis la médiathèque
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune image dans le diaporama. Ajoute-en via l&apos;upload ou la
          médiathèque.
        </p>
      ) : (
        <div className="grid gap-2">
          {rows.map((r, i) => (
            <div
              key={r.key}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-2.5"
            >
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicImageUrl(r.path)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <Input
                value={r.caption}
                onChange={(e) => patch(r.key, { caption: e.target.value })}
                placeholder="Petit texte affiché sur l'image (optionnel)"
                className="min-w-[160px] flex-1"
              />
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Monter"
                  disabled={i === 0}
                  onClick={() => move(r.key, -1)}
                >
                  <ChevronUp className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Descendre"
                  disabled={i === rows.length - 1}
                  onClick={() => move(r.key, 1)}
                >
                  <ChevronDown className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Retirer"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(r.key)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {picker && (
        <LibraryPicker
          assets={assets}
          folders={folders}
          onClose={() => setPicker(false)}
          onPick={(paths) => {
            addPaths(paths);
            setSeq((s) => s + paths.length);
            setPicker(false);
          }}
        />
      )}
    </div>
  );
}
