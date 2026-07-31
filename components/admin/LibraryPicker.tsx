"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X, Check } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";

/** Sélecteur multiple d'images de la médiathèque → renvoie leurs clés Storage.
 *
 *  Modale plein écran, recherche sur toute la banque + filtre par dossier,
 *  sélection multiple. Partagé par l'éditeur de galerie d'article et l'éditeur
 *  de diaporama du hero (mêmes besoins : choisir plusieurs assets, récupérer
 *  leurs `storage_path` sans créer d'enregistrements). */
export function LibraryPicker({
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
