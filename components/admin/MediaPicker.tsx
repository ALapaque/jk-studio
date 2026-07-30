"use client";

import { useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { X, Check, Images } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import { attachAssets } from "@/app/admin/media-actions";
import { Button } from "@/components/ui/button";

/** Sélecteur « depuis la médiathèque » : ouvre la banque, laisse choisir une
 *  ou plusieurs images, et les rattache à la série/catégorie courante.
 *
 *  Modèle référence : rattacher ne copie pas le fichier, il pointe la nouvelle
 *  ligne `photos` vers le même asset (via la Server Action attachAssets). */
export function MediaPicker({
  ownerField,
  ownerId,
  assets,
  folders,
}: {
  ownerField: "project_id" | "category_id";
  ownerId: string;
  assets: MediaAssetRow[];
  folders: MediaFolderRow[];
}) {
  const [open, setOpen] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  // Une recherche porte sur TOUTE la médiathèque (nom de fichier + texte alt),
  // tous dossiers confondus — c'est là son intérêt : rattacher une image sans
  // savoir où elle est rangée. Sans recherche, on reste sur la vue par dossier.
  const visible = useMemo(() => {
    if (q) {
      return assets.filter((a) =>
        `${a.filename ?? ""} ${a.alt ?? ""}`.toLowerCase().includes(q),
      );
    }
    return assets.filter((a) => (a.folder_id ?? null) === folderId);
  }, [assets, folderId, q]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const close = () => {
    setOpen(false);
    setSelected(new Set());
    setError(null);
  };

  const confirm = () => {
    if (!selected.size) return close();
    setError(null);
    const fd = new FormData();
    fd.set("owner_field", ownerField);
    fd.set("owner_id", ownerId);
    fd.set("asset_ids", [...selected].join(","));
    startTransition(async () => {
      try {
        await attachAssets(fd);
        close();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Rattachement impossible.");
      }
    });
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Images className="size-4" /> Depuis la médiathèque
      </Button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Choisir depuis la médiathèque"
          className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <h2 className="text-base font-semibold">Médiathèque</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher (toute la médiathèque)…"
                aria-label="Rechercher une image"
                className="w-56 rounded-md border border-input bg-transparent px-2 py-1.5 text-sm"
              />
              <select
                value={folderId ?? ""}
                onChange={(e) => setFolderId(e.target.value || null)}
                disabled={!!q}
                title={q ? "Recherche active sur toute la médiathèque" : undefined}
                className="rounded-md border border-input bg-transparent px-2 py-1.5 text-sm disabled:opacity-50"
              >
                <option value="">Racine</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fermer"
                onClick={close}
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {visible.length ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {visible.map((a) => {
                  const on = selected.has(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toggle(a.id)}
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
            {error ? (
              <span className="text-sm text-destructive">{error}</span>
            ) : (
              <span className="text-sm text-muted-foreground">
                {selected.size} sélectionnée(s)
              </span>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={close} disabled={pending}>
                Annuler
              </Button>
              <Button onClick={confirm} disabled={pending || !selected.size}>
                {pending ? "Ajout…" : `Ajouter ${selected.size || ""}`.trim()}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
