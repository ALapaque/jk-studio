"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Upload,
  Images,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Check,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import { Input } from "./ui";
import { Button } from "@/components/ui/button";

/** Galerie média d'un article : liste ordonnée d'images + légende.
 *
 *  Deux sources : téléversement direct (Storage, préfixe journal/media) ou choix
 *  dans la médiathèque (par référence — on ne stocke que la clé). Réordonnable,
 *  supprimable, légende par image. La liste est sérialisée en JSON dans un champ
 *  caché « media » soumis avec le formulaire de l'article (action updatePost). */

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

type Row = { path: string; caption: string; key: string };

export function PostMediaEditor({
  initial,
  assets,
  folders,
}: {
  initial: { path: string; caption: string }[];
  assets: MediaAssetRow[];
  folders: MediaFolderRow[];
}) {
  const [rows, setRows] = useState<Row[]>(
    initial.map((m, i) => ({ path: m.path, caption: m.caption ?? "", key: `i-${i}` })),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [picker, setPicker] = useState(false);
  const [seq, setSeq] = useState(0);

  const serialized = JSON.stringify(
    rows.filter((r) => r.path).map((r) => ({ path: r.path, caption: r.caption.trim() })),
  );

  const addPaths = (paths: string[]) =>
    setRows((rs) => [
      ...rs,
      ...paths.map((path, i) => ({ path, caption: "", key: `n-${seq + i}` })),
    ]);
  const patch = (key: string, next: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...next } : r)));
  const remove = (key: string) => setRows((rs) => rs.filter((r) => r.key !== key));
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
        const path = `journal/media/${crypto.randomUUID()}.${slugExt(file.name)}`;
        const { error: upErr } = await sb.storage
          .from(STORAGE_BUCKET)
          .upload(path, file, { contentType: file.type || undefined, upsert: false });
        if (upErr) throw upErr;
        uploaded.push(path);
      }
      setRows((rs) => [
        ...rs,
        ...uploaded.map((path, i) => ({ path, caption: "", key: `n-${seq + i}` })),
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
      <input type="hidden" name="media" value={serialized} />

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
        <Button type="button" variant="outline" size="sm" onClick={() => setPicker(true)}>
          <Images className="size-4" /> Depuis la médiathèque
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Aucune image dans la galerie. Ajoute-en via l&apos;upload ou la médiathèque.
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
                placeholder="Légende (optionnel)"
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

/** Sélecteur multiple d'images de la médiathèque → renvoie leurs clés Storage. */
function LibraryPicker({
  assets,
  folders,
  onPick,
  onClose,
}: {
  assets: MediaAssetRow[];
  folders: MediaFolderRow[];
  onPick: (paths: string[]) => void;
  onClose: () => void;
}) {
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (q) {
      return assets.filter((a) =>
        `${a.filename ?? ""} ${a.alt ?? ""}`.toLowerCase().includes(q),
      );
    }
    return assets.filter((a) => (a.folder_id ?? null) === folderId);
  }, [assets, folderId, q]);

  const toggle = (path: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(path)) n.delete(path);
      else n.add(path);
      return n;
    });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Choisir des images"
      className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border p-4">
        <h2 className="text-base font-semibold">Médiathèque</h2>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="w-56 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm"
          />
          <select
            value={folderId ?? ""}
            onChange={(e) => setFolderId(e.target.value || null)}
            disabled={!!q}
            className="rounded-md border border-input bg-transparent px-2 py-1.5 text-sm disabled:opacity-50"
          >
            <option value="">Racine</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <Button variant="ghost" size="icon" aria-label="Fermer" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {visible.length ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {visible.map((a) => {
              const on = selected.has(a.storage_path);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggle(a.storage_path)}
                  aria-pressed={on}
                  className={[
                    "relative aspect-square overflow-hidden rounded-lg border-2 transition-colors",
                    on ? "border-primary" : "border-transparent",
                  ].join(" ")}
                >
                  <Image
                    src={publicImageUrl(a.storage_path)}
                    alt={a.alt ?? a.filename ?? ""}
                    fill
                    sizes="(max-width:640px) 33vw, 16vw"
                    className="object-cover"
                  />
                  {on && (
                    <span className="absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {q ? "Aucun résultat." : "Aucune image dans ce dossier."}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border p-4">
        <span className="text-sm text-muted-foreground">
          {selected.size} sélectionnée(s)
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={() => onPick([...selected])} disabled={!selected.size}>
            Ajouter {selected.size || ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
