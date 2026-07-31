"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Check, Images } from "lucide-react";
import { publicImageUrl } from "@/lib/supabase/storage";
import type { MediaAssetRow, MediaFolderRow } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";

/** Choisit l'image de couverture (série ou catégorie) DEPUIS la médiathèque.
 *
 *  Modèle « référence » : on ne copie pas le fichier, on pointe simplement
 *  `cover_path` sur la clé Storage de l'asset choisi (via la même Server Action
 *  que l'upload de couverture). Recherche sur toute la banque + filtre par
 *  dossier, comme le sélecteur de photos. Sélection unique, appliquée sur clic
 *  du bouton (pas au survol) pour éviter les fausses manœuvres. */
export function CoverFromLibrary({
  ownerId,
  idField,
  action,
  assets,
  folders,
}: {
  ownerId: string;
  // Nom du champ portant l'identifiant du destinataire. Série/catégorie
  // utilisent "project_id"/"category_id" ; une cible site_content (ex. le hero)
  // passe un champ ignoré par son action (qui ne lit que `storage_path`).
  idField: string;
  action: (formData: FormData) => void | Promise<void>;
  assets: MediaAssetRow[];
  folders: MediaFolderRow[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (q) {
      return assets.filter((a) =>
        `${a.filename ?? ""} ${a.alt ?? ""}`.toLowerCase().includes(q),
      );
    }
    return assets.filter((a) => (a.folder_id ?? null) === folderId);
  }, [assets, folderId, q]);

  const close = () => {
    setOpen(false);
    setSelected(null);
    setError(null);
  };

  const apply = () => {
    const asset = assets.find((a) => a.id === selected);
    if (!asset) return;
    setError(null);
    const fd = new FormData();
    fd.set(idField, ownerId);
    fd.set("storage_path", asset.storage_path);
    startTransition(async () => {
      try {
        await action(fd);
        router.refresh();
        close();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Impossible de définir la couverture.");
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
          aria-label="Choisir la couverture depuis la médiathèque"
          className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <h2 className="text-base font-semibold">Couverture — médiathèque</h2>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher…"
                aria-label="Rechercher une image"
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
              <Button variant="ghost" size="icon" aria-label="Fermer" onClick={close}>
                <X className="size-5" />
              </Button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {visible.length ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                {visible.map((a) => {
                  const on = selected === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setSelected(a.id)}
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
                {selected ? "1 image sélectionnée" : "Sélectionne une image"}
              </span>
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={close} disabled={pending}>
                Annuler
              </Button>
              <Button onClick={apply} disabled={pending || !selected}>
                {pending ? "Application…" : "Définir comme couverture"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
